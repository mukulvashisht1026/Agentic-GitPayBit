import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StateGraph } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { z } from "zod";
import "dotenv/config";
import githubProfileLookupTool from "../tools/tool";



export async function callAgent(client: MongoClient, query: string, thread_id: string) {
    // Define the MongoDB database and collection
    const dbName = "github_database";
    const db = client.db(dbName);
    const collection = db.collection("contributions");
    // ... (We'll add the rest of the code here)
    
    const GraphState = Annotation.Root({
        messages: Annotation<BaseMessage[]>({
          reducer: (x, y) => x.concat(y),
        }),
    });


    const gitContributionsLookupTool = tool(
        async ({ query, n = 10 }) => {
          console.log("Employee lookup tool called");
          const dbConfig = {
            collection: collection,
            indexName: "vector_index",
            textKey: "embedding_text",
            embeddingKey: "embedding",
          };
          const vectorStore = new MongoDBAtlasVectorSearch(
            new OpenAIEmbeddings(),
            dbConfig
          );
          const result = await vectorStore.similaritySearchWithScore(query, n);
          return JSON.stringify(result);
        },
        {
          name: "github_contribution_lookup",
          description: "Gathers github contribution data from contribitions database",
          schema: z.object({
            query: z.string().describe("The search query"),
            n: z.number().optional().default(10).describe("Number of results to return"),
          }),
        }
      );


    // const githubRatingTool = tool(
    //     async ()
    // ) 

    const tools = [gitContributionsLookupTool, githubProfileLookupTool];

    // We can extract the state typing via `GraphState.State`
    const toolNode = new ToolNode<typeof GraphState.State>(tools);

    const model = new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0,
    }).bindTools(tools);


    async function callModel(state: typeof GraphState.State) {
        const prompt = ChatPromptTemplate.fromMessages([
          [
            "system",
            `You are a helpful AI assistant, collaborating with other assistants. Use the provided tools to progress towards answering the question. If you are unable to fully answer, that's OK, another assistant with different tools will help where you left off. Execute what you can to make progress. If you or any of the other assistants have the final answer or deliverable, prefix your response with FINAL ANSWER so the team knows to stop. You have access to the following tools: {tool_names}.\n{system_message}\nCurrent time: {time}.`,
          ],
          new MessagesPlaceholder("messages"),
        ]);
        const formattedPrompt = await prompt.formatMessages({
          system_message: "You are helpful Github Manager Chatbot Agent.",
          time: new Date().toISOString(),
          tool_names: tools.map((tool) => tool.name).join(", "),
          messages: state.messages,
        });
        const result = await model.invoke(formattedPrompt);
        return { messages: [result] };
      }


      function shouldContinue(state: typeof GraphState.State) {
        const messages = state.messages;
        const lastMessage = messages[messages.length - 1] as AIMessage;
        // If the LLM makes a tool call, then we route to the "tools" node
        if (lastMessage.tool_calls?.length) {
          return "tools";
        }
        // Otherwise, we stop (reply to the user)
        return "__end__";
      }


      const workflow = new StateGraph(GraphState)
        .addNode("agent", callModel)
        .addNode("tools", toolNode)
        .addEdge("__start__", "agent")
        .addConditionalEdges("agent", shouldContinue)
        .addEdge("tools", "agent");


    const checkpointer = new MongoDBSaver({ client, dbName });
    const app = workflow.compile({ checkpointer });


    const finalState = await app.invoke(
        {
          messages: [new HumanMessage(query)],
        },
        { recursionLimit: 15, configurable: { thread_id: thread_id } }
      );
      console.log(finalState.messages[finalState.messages.length - 1].content);
      return finalState.messages[finalState.messages.length - 1].content;
}


