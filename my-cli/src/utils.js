import { got } from "got";
import {
  log,
  error,
  displayAmount,
  displayCategory,
  displayID,
  displayInfo,
  displayKey,
  displayName,
  displayRRP,
  displaySuccess,
  displayText,
  displayTimestamp,
} from "./displays.js";

const API = "http://localhost:3000";

export const categories = ["confectionery", "electronics"];

export async function update(id, amount) {
  log(`${displayTimestamp()}`);
  log(
    `${displayInfo(`Updating Order`)} ${displayID(id)} ${displayText(
      "with amount"
    )} ${displayAmount(amount)}`
  );
  try {
    if (isNaN(+amount)) {
      error(" must be a number");
      process.exit(1);
    }
    await got.post(`${API}/orders/${id}`, {
      json: { amount: +amount },
    });
    log(
      `${displaySuccess()} ${displayText("Order")} ${displayID(
        id
      )} ${displayText("updated with amount")} ${displayAmount(amount)}`
    );
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

export async function add(...args) {
  let [category, id, name, amount, info] = args;
  log(`${displayTimestamp()}`);
  log(
    `${displayInfo(`Request to add item to category`)} ${displayCategory(
      category
    )}`
  );
  log(
    `${displayText("Adding item")} ${displayID(id)} ${displayText(
      "with amount"
    )} ${displayAmount(`$${amount}`)}`
  );
  try {
    if (isNaN(+amount)) {
      error(`<AMOUNT> must be a number`);
      process.exit(1);
    }
    await got.post(`${API}/${category}`, {
      json: {
        id,
        name,
        rrp: +amount,
        info: info.join(" "),
      },
    });
    log(
      `${displaySuccess("Product Added! :")} ${displayID(id)} ${displayText("-")} ${displayName(
        name
      )} ${displayText("has been added to the")} ${displayCategory(
        category
      )} ${displayText("category")}`
    );
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}

export function listCategories() {
  log(displayTimestamp());
  log(displayInfo("Listing Categories"));
  try {
    log(displayText("Categories received from API:"));
    for (const cat of categories) log(displayCategory(cat));
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}

export async function listCategoryItems(category) {
  log(displayTimestamp());
  log(`${displayInfo(`List IDs`)}`);
  try {
    const result = await got(`${API}/${category}/`).json();
    log(`${displaySuccess("IDs received from API:")}`);
    for (const item of result) {
      log(
        `${displayKey("ID:")}\t ${displayID(item.id)} ${displayKey(`Name:`)}\t ${displayName(item.name)} ${displayKey("RRP:")}\t ${displayRRP(item.rrp)} ${displayKey("Product Info:")}\n\t ${displayText(item.info)}`
      );
    }
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}
