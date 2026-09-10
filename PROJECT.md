````markdown
# SRT Translator

## Description

**SRT Translator** is a web application that translates subtitle (`.srt`) files into a language selected by the user.

The application uses the **Google Translate API** to translate subtitle text while preserving the original subtitle timing and structure. After the translation is completed, the application generates a new `.srt` file that the user can download and use with a movie or video player.

## How It Works

1. The user uploads an `.srt` subtitle file for a movie or video.
2. The application reads and parses the subtitle file.
3. The user selects the language they want the subtitles to be translated into.
4. The user presses the **Start** button to begin the translation process.
5. The application processes the subtitle entries and sends the subtitle text to the **Google Translate API**.
6. The translated text returned by the API is matched with the original subtitle timestamps.
7. The application constructs a new `.srt` file containing the translated subtitle text while preserving the original timing information.
8. The translated `.srt` file is provided to the user.
9. The user can load the translated subtitle file into their preferred video player.

A typical SRT entry looks like this:

```text
1
00:00:05,000 --> 00:00:08,000
Hello, how are you?
````

## Main Features

* Upload `.srt` subtitle files
* Parse subtitle text and timestamps
* Select a target translation language
* Translate subtitle text using Google Translate API
* Preserve the original subtitle timestamps
* Generate a new translated `.srt` file
* Download and use the translated subtitle file

## Tech Stack

### Frontend

* **React** - User interface and application logic
* **TypeScript** - Type-safe JavaScript development
* **Axios** - HTTP requests to external APIs

### Translation

* **Google Translate API** - Translation of subtitle text

## Basic Workflow

```text
Upload .srt File
       ↓
Parse Subtitle File
       ↓
Select Target Language
       ↓
Start Translation
       ↓
Send Subtitle Text to Google Translate API
       ↓
Receive Translated Text
       ↓
Combine Translation with Original Timestamps
       ↓
Generate New .srt File
       ↓
Download Translated Subtitle
```

## Future Development

### Google Gemini

In future versions, **Google Gemini** may be added to provide more sophisticated and context-aware translations.

Unlike direct sentence-by-sentence translation, Gemini could use multiple subtitle lines as context to better understand conversations and produce more natural translations.

Possible improvements include:

* Better understanding of conversation context
* More natural translations
* Better handling of slang, jokes, and expressions
* More consistent translation of names and terminology
* Using previous and following subtitle lines as context

Users may eventually be able to select which translation method they want to use:

```text
Translation Method
├── Google Translate
└── Google Gemini
```

### Firebase

**Firebase** may also be added in future development for analytics and application usage monitoring.

Possible analytics include:

* Number of subtitle files translated
* Most frequently selected languages
* Translation method usage
* Application usage statistics
* Translation errors and failures
* General user interaction with the application

## Planned Tech Stack

```text
Frontend
├── React
├── TypeScript
└── Axios

Translation
├── Google Translate API
└── Google Gemini API (planned)

Analytics
└── Firebase (planned)
```

## Goal

The goal of **SRT Translator** is to make subtitle translation simple and convenient.

Instead of manually translating every subtitle line, users can upload an existing subtitle file, select a target language, and automatically generate a translated subtitle file that can be used with their movie or video player.

In later versions, the project may use Google Gemini to improve translation quality through contextual AI translation and Firebase to collect analytics about application usage.

```
```
