![HelloKitchen banner](./docs/images/banner.png)

# HelloKitchen - Back-End

Welcome to the **HelloKitchen** Back-End repository! This project powers the server-side functionality of the HelloKitchen platform.

---

## 🛠️ Project Setup

To get started, install the required dependencies:

```bash
$ npm install
```

## ⚙️ Environment Configuration

Create a `.env` file at the root of the project with the following variables:

```
SALT_HASH = [Salt hash used for login]
DB_URL_LOCAL = [Database URL for local development]
DB_URL = [Database URL for production]
```

## 🚀 Running the Project

You can compile and run the project using the following commands:

### Development Mode

```bash
$ npm run start
```

### Watch Mode (Auto-reload)

```bash
$ npm run start:dev
```

### Production Mode

```bash
$ npm run start:prod
```

## 🧪 Running Tests

Ensure code quality with the available tests:

### Unit Tests

```bash
$ npm run test
```

### End-to-End (E2E) Tests

```bash
$ npm run test:e2e
```

### Test Coverage

```bash
$ npm run test:cov
```

## 📄 Documentation

Comprehensive documentation for the project can be found in the [Wiki section of the GitHub repository](https://github.com/Hello-Kitchen/Back-End/wiki).

## 🤝 Contribution Guidelines

Currently, this project does **not accept external contributions**. Feel free to explore the codebase, but contribution via pull requests is restricted.
