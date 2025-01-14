#!/usr/bin/env node
import { Command } from "commander";
import {
  update,
  add,
  listCategories,
  listCategoryItems,
} from "../src/utils.js";
const program = new Command();
const API = "http://localhost:3000";
const usage = (msg = "Back office for My App") => {
  console.log(`\n${msg}\n`);
};

program.name("my-cli");
program.description("Back office for My App").version("1.0.0");
program
  .command("update")
  .argument("<ID>", "Order ID")
  .argument("<AMOUNT>", "Order Amount")
  .action(async (id, amount) => await update(id, amount));
program
  .command("add")
  .description("Add Product by ID to a Category")
  .argument("<CATEGORY>", "Product Category")
  .argument("<ID>", "Product ID")
  .argument("<NAME>", "Product Name")
  .argument("<AMOUNT>", "Product RRP")
  .argument("[INFO...]", "Product Info")
  .action(
    async (category, id, name, amount, info) =>
      await add(category, id, name, amount, info)
  );

program
  .command("list")
  .description("List categories")
  .argument("[CATEGORY]", "Category to list IDs for")
  .option("-a, --all", "List all categories")
  .action(async (args, opts) => {
    if (args && opts.all)
      throw new Error("Cannot specify both category and 'all'");
    if (opts.all || args === "all") {
      listCategories();
    } else if (args === "confectionery" || args === "electronics") {
      await listCategoryItems(args);
    } else {
      throw new Error("Invalid category specified");
    }
  });
program.parse();
