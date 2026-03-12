const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// WhatsApp API credentials
const WHATSAPP_API_URL = "https://graph.facebook.com/v20.0/765254063343786/messages";
const TOKEN = "EAAPZCE0HDjnkBPfo21oocDxTNIxSHqJfbVZCZCFsqySK1yZBMUDleQVciSghEhPIgEOiAP5ADIoh78ZAOeh4OZCyH2w9N18XBjALFCxIjfldWQdqwME58G9Ykx51peKhZC00kfaZAfiEc95UPZC9ZAMgzLp9ZCCa1ZC9h0MWA0ODB3KnPFUmQlKB9CZCpcFC6w8gnzoqGCF4g9ebtiyAeYUrS1ynMgiJMeUIhbZAChAmpynfCkLgwwbgZDZD";

// Function to send WhatsApp message
async function sendWhatsAppUpdate(to, name, orderId, status) {
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        to: to, // Customer phone number in international format
        type: "template",
        template: {
          name: "order_update", // Template you approved in Meta Business Manager
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: name },
                { type: "text", text: orderId },
                { type: "text", text: status }
              ]
            }
          ]
        }
      },
      { headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" } }
    );

    console.log("Message sent:", response.data);
  } catch (err) {
    console.error("Error sending message:", err.response ? err.response.data : err.message);
  }
}

// Example API endpoint for order status update
app.post("/update-order", async (req, res) => {
  const { customerPhone, customerName, orderId, status } = req.body;

  await sendWhatsAppUpdate(customerPhone, customerName, orderId, status);
  res.json({ success: true, message: "WhatsApp update sent!" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
