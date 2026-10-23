"""Offline demonstration; no external services or credentials required."""
import argparse, json
from decimal import Decimal, InvalidOperation

def simulate(issue, bounty, approved):
    return {"mode": "mock; no wallet, LLM, GitHub write, or transaction",
            "issue": issue, "bounty": str(bounty), "asset": "demo credits",
            "review": "approved" if approved else "pending",
            "payment": "simulated payout ready" if approved else "blocked until review approval"}

if __name__ == "__main__":
    p = argparse.ArgumentParser(description="Offline issue-review/payment workflow demonstration.")
    p.add_argument("--issue", default="demo/repository#1")
    p.add_argument("--bounty", default="5.00")
    p.add_argument("--approved", action="store_true", help="simulate a completed reviewer approval")
    a = p.parse_args()
    try: bounty = Decimal(a.bounty)
    except InvalidOperation: p.error("bounty must be a number")
    if not bounty.is_finite() or bounty <= 0: p.error("bounty must be positive and finite")
    print(json.dumps(simulate(a.issue, bounty, a.approved), indent=2))
