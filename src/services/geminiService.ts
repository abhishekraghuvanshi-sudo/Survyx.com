/**
 * SURVYX AI Assistant Client Service
 * Calls the secure full-stack server endpoint /api/gemini/chat
 */

export interface ChatResponse {
  reply: string;
  source?: 'gemini' | 'offline-concierge';
}

export const getPriyaResponse = async (userMessage: string, context: string): Promise<string> => {
  try {
    const res = await fetch("/api/gemini/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        context: context,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data: ChatResponse = await res.json();
    return data.reply || "I am monitoring the trade registry. How can I assist you further?";
  } catch (error) {
    console.warn("API Assistant fallback triggered:", error);
    // Intelligent client-side fallback
    const msg = userMessage.toLowerCase();
    if (msg.includes("rfq") || msg.includes("procurement") || msg.includes("buy")) {
      return "I can assist in optimizing your Request for Quotation (RFQ). Make sure your quantity, tolerance thresholds, and NABL test requirements are specified in your BOM to attract top-tier suppliers.";
    }
    if (msg.includes("escrow") || msg.includes("fund") || msg.includes("payment")) {
      return "Your capital is held within the Survyx Multi-Signature Escrow Vault. Funds can only disburse when both you and your trading partner digitally sign each milestone.";
    }
    return "Officer Priya here. I am tracking your active session, EUID verification status, and Escrow Vault balances. How can I assist your trade governance today?";
  }
};
