const axios = require("axios");

async function testCreateTodo() {
  try {
    console.log("🧪 Testing POST /api/todos...");

    const response = await axios.post("http://localhost:5000/api/todos", {
      task: "Test todo from Node.js script",
    });

    console.log("✅ Success! Server Response:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("❌ Full Error Details:");
    console.log("Status:", error.response?.status);
    console.log("Status Text:", error.response?.statusText);
    console.log("Error Data:", error.response?.data);
    console.log("Error Message:", error.message);
  }
}

setTimeout(() => {
  testCreateTodo();
}, 1000);
