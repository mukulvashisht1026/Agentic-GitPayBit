import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import {StructuredOutputParser} from "@langchain/core/output_parsers";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import {z} from "zod";
import "dotenv/config";

const client = new MongoClient(process.env.MONGODB_CONNECTION_URL as string);

const llm = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.7,
})


const GithubContributionSchema = z.object({
    pullRequestId: z.string(),
    repoName: z.string(),
    organisationName: z.string(),
})


type GithubContributionType = z.infer<typeof GithubContributionSchema>;
const parser = StructuredOutputParser.fromZodSchema(z.array(GithubContributionSchema));


async function generateSyntheticData(): Promise<GithubContributionType[]> {
    const prompt = `You are a helpful assistant that generates github contribution data. Generate 10 fictional github contribution data records.
     Each record should contain pullRequestId repoName and organisationName. Ensure variety in data and realistic values.
     ${parser.getFormatInstructions()}
     `

     console.log("generate synthetic data");
     const response = await llm.invoke(prompt);
     return parser.parse(response.content as string);
     
}


async function createGithubContributionSummary(GithubContribution: GithubContributionType): Promise<string> {
    return new Promise((resolve) => {
      const repoDetails = `${GithubContribution.repoName} in ${GithubContribution.organisationName}`;
    //   const skills = employee.skills.join(", ");
    //   const performanceReviews = employee.performance_reviews
    //     .map(
    //       (review) =>
    //         `Rated ${review.rating} on ${review.review_date}: ${review.comments}`
    //     )
    //     .join(" ");
        const Pr = GithubContribution.pullRequestId;
    //   const basicInfo = `${employee.first_name} ${employee.last_name}, born on ${employee.date_of_birth}`;
    //   const workLocation = `Works at ${employee.work_location.nearest_office}, Remote: ${employee.work_location.is_remote}`;
    //   const notes = employee.notes;
      const summary = `repo-details: ${repoDetails}, pull-request-number: ${Pr}`;
      resolve(summary);
    });
}

async function seedDatabase(): Promise<void> {
    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      const db = client.db("github_database");
      const collection = db.collection("contributions");
      await collection.deleteMany({});
      
      const syntheticData = await generateSyntheticData();
      const recordsWithSummaries = await Promise.all(
        syntheticData.map(async (record) => ({
          pageContent: await createGithubContributionSummary(record),
          metadata: {...record},
        }))
      );
      
      for (const record of recordsWithSummaries) {
        await MongoDBAtlasVectorSearch.fromDocuments(
          [record],
          new OpenAIEmbeddings(),
          {
            collection,
            indexName: "vector_index",
            textKey: "embedding_text",
            embeddingKey: "embedding",
          }
        );
        console.log("Successfully processed & saved record:", record.metadata);
      }
      console.log("Database seeding completed");
    } catch (error) {
      console.error("Error seeding database:", error);
    } finally {
      await client.close();
    }
  }
  seedDatabase().catch(console.error);

