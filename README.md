# FrameCounterFH Backend

Clone the GitHub repository:

```bash
git clone https://github.com/Fallbackodin/FrameCounterFH.git
```

## Setup

Install dependencies:

```bash
npm install
```

## Run the server

Start the app in development mode:

```bash
npm run dev
```

The server runs on port 3000 by default.

## Use the FrameCounter in Postman

1. Start the server with `npm run dev`.
2. Open Postman and create a new `POST` request.
3. Set the URL to `http://localhost:3000/file-upload`.
4. In the `Body` tab, choose `form-data`.
5. Add a key named `file`.
6. In the row for `file`, change the type from `Text` to `File`.
7. Choose an MP3 file from your computer.
8. Send the request.

The response will include the frame count result from the backend.

## Check code quality

Run linting:

```bash
npm run lint
```

Run formatting:

```bash
npm run format
```

Run tests:

```bash
npm test
```
