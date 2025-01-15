#!/usr/bin/env node
import { Command } from "commander";
import {
  add,
  listCategories,
  listCategoryItems,
  update,
  categories,
} from "../src/utils.js";

import { interactiveApp } from "../src/prompts.js";

export const program = new Command();

program
  .name("my-cli")
  .description("Back office for My App")
  .version("1.0.0")
  .option("-i, --interactive", "Run App in interactive mode")
  .action(() => {});
program
  .command("update")
  .description("Update an order")
  .option("-i, --interactive", "Run Update Command in interactive mode")
  .argument("[ID]", "Order ID")
  .argument("[AMOUNT]", "Order Amount");
program
  .command("add")
  .description("Add Product by ID to a Category")
  .option("-i, --interactive", "Run Update Command in interactive mode")
  .argument("[CATEGORY]", "Product Category")
  .argument("[ID]", "Product ID")
  .argument("[NAME]", "Product Name")
  .argument("[AMOUNT]", "Product RRP")
  .argument("[INFO...]", "Product Info");
program
  .command("list")
  .description("List categories")
  .option("-i, --interactive", "Run Update Command in interactive mode")
  .option("-a, --all", "List all categories")
  .argument("[CATEGORY]", "Category to list IDs for");
program.parse();

async function main(program) {
  const command = program?.args.at(0) || "";
  const cliArgs = program?.args.slice(1) || [];
  const options = program?.opts() || {};
  if (!command && !options.interactive) {
    program.help();
  }
  if (!command && options.interactive) {
    return interactiveApp();
  }
  if (command && options.interactive) {
    return interactiveApp(command);
  }
  if (options.interactive && cliArgs.length > 0) {
    throw new Error("Cannot specify both interactive and command");
    process.exit(1);
  }
  switch (command) {
    case "add": {
      const [category, id, name, amount, info] = cliArgs;
      if (
        !categories.includes(category) ||
        !category ||
        !id ||
        !name ||
        !amount
      ) {
        throw new Error("Invalid arguments specified");
      }
      await add(category, id, name, amount, info);
      break;
    }
    case "update": {
      const [id, amount] = cliArgs;
      if (!id && !amount) {
        throw new Error("Invalid arguments specified");
      }
      await update(id, amount);
      break;
    }
    case "list": {
      const { all } = options;
      const [category] = cliArgs;
      if (category && all)
        throw new Error("Cannot specify both category and 'all'");
      if (all || category === "all") {
        listCategories();
      } else if (categories.includes(category)) {
        await listCategoryItems(category);
      } else {
        throw new Error("Invalid category specified");
      }
      break;
    }
    default:
      await interactiveApp();
  }
}
main(program);
