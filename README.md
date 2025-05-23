# Hyperlocal

Hyperlocal is a real-time AI-powered chat interface that answers user questions about local disruptions across cities worldwide using live web data. Built for the Bright Data Real-Time AI Agents Hackathon, this application leverages advanced web scraping and AI technologies to provide up-to-date information about traffic, public transport, weather events, and more.

![Hyperlocal Demo](https://i.imgur.com/PZsAMT1.gif)

## 🌟 Features

- **Real-time Disruption Information**: Get the latest updates on traffic delays, public transport interruptions, protests, weather events, and construction projects.
- **Natural Language Interface**: Ask questions about disruptions in specific cities or areas.
- **Hyperlocal Context**: Specify streets, neighborhoods, or landmarks for highly targeted information.
- **Multi-source Data**: Aggregates information from multiple sources for comprehensive coverage.

## 🚀 Technologies

- **Next.js**: React framework for the frontend application
- **LlamaIndex.ts**: For structured data extraction and LLM calls
- **Bright Data MCP server**: Model Context Protocol tools for web scraping and extraction

## 🔍 How to Use

1. **Ask About Disruptions**: Type your question in the chat input, making sure to specify a city or location.
   - Example: "Are there any road closures in downtown Chicago?"
   - Example: "What's causing delays at London Heathrow Airport?"
   - Example: "Is the metro currently running on time in Paris?"

2. **View Responses**: The AI will process your query and return relevant, real-time information about disruptions in the specified area.

## 🧠 How It Works

1. **User Query**: The user submits a question about disruptions in a specific location.
2. **Query Processing**: The agent extracts location, language, iso-code from the user's query.
3. **Data Collection**: Using Bright Data MCP server, the agent decides which tools to use in order to scrape and extract real-time data from the most relevant sources.
4. **Data Analysis**: The collected data is analyzed to only keep relevant information.
5. **Response Generation**: The agent provides a summary based on the analyzed data, presented to the user in a conversational format.

## 📝 License

[CC-BY-NC License](LICENSE.md)

## 🙏 Acknowledgements

- Built for the Bright Data Real-Time AI Agents Hackathon
