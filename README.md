# Lyrical: Language Learning Through Reading

Lyrical is an application I've developed to improve language learning through interactive reading. It uses AI to generate texts and provide grammatical analysis, helping users learn new languages in context.

## Purpose

Lyrical addresses some common challenges in language learning:

1. Lack of engaging, level-appropriate reading material
2. Difficulty understanding grammar in context
3. Limited opportunities for vocabulary acquisition in real-world usage

By presenting AI-generated texts with detailed word-by-word breakdowns, Lyrical allows learners to explore language structures and expand their vocabulary while reading about topics that interest them.

## How It Works

The app uses Next.js and the Vercel AI SDK to generate texts and analyze them grammatically. Users can interact with the content, exploring each sentence and word in detail.

## Contributing

I welcome contributions to Lyrical. Here's how you can help:

1. Fork the repository and create your branch from `main`
2. Install dependencies with `bun install`
3. Make your changes and test them
4. Ensure your code follows the existing style
5. Create a pull request describing your changes

## Future Plans

I'm considering several additions to Lyrical:

1. Visualizations of grammatical structures
2. A system to track and reintroduce previously encountered words
3. Integration of GPT-4's audio capabilities (gpt-4-audio-preview)

The audio integration is particularly exciting as it will enable text-to-speech and speech-to-text functionalities. This addition will be crucial for improving pronunciation and listening skills, making Lyrical a more comprehensive language learning tool.

## Getting Started

To run Lyrical locally:

1. Clone the repository
2. Copy `.env.example` to `.env` and add the required API keys
3. Add your OpenAI API key to the `.env` file as `OPENAI_API_KEY=your_api_key_here`
4. Run `bun install` to install dependencies
5. Start the development server with `bun dev`

I hope Lyrical can be a useful tool for language learners and welcome your contributions to improve it.
