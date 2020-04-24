//@ts-check
const CosmosClient = require("@azure/cosmos").CosmosClient;

const config = require("./config");
const url = require("url");
const uniqid = require("uniqid");

const endpoint = config.endpoint;
const key = config.key;

const databaseId = config.database.id;
const containerId = config.container.id;
const partitionKey = { kind: "Hash", paths: ["/title"] };

const client = new CosmosClient({ endpoint, key });

class Cache {

  constructor() {
      this.data = []
  }

  get isValid() {
    if (!this.lastFetch) return false
    const FiveMinutesInMSecs = 5 * 60 * 1000;
    const now = new Date();
    return now.valueOf() - this.lastFetch.valueOf() < FiveMinutesInMSecs;
  }

  reset(newData) {
    this.data = newData;
    this.lastFetch = new Date()
  }
}

const cache = new Cache()

/**
 * Create the database if it does not exist
 */
async function createDatabase() {
  const { database } = await client.databases.createIfNotExists({
    id: databaseId,
  });
  console.log(`Created database:\n${database.id}\n`);
}

/**
 * Read the database definition
 */
async function readDatabase() {
  const { resource: databaseDefinition } = await client
    .database(databaseId)
    .read();
  console.log(`Reading database:\n${databaseDefinition.id}\n`);
}

/**
 * Create the container if it does not exist
 */
async function createContainer() {
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey },
      { offerThroughput: 400 }
    );
  console.log(`Created container:\n${config.container.id}\n`);
}

/**
 * Read the container definition
 */
async function readContainer() {
  const { resource: containerDefinition } = await client
    .database(databaseId)
    .container(containerId)
    .read();
  console.log(`Reading container:\n${containerDefinition.id}\n`);
}

/**
 * Scale a container
 * You can scale the throughput (RU/s) of your container up and down to meet the needs of the workload. Learn more: https://aka.ms/cosmos-request-units
 */
async function scaleContainer() {
  const { resource: containerDefinition } = await client
    .database(databaseId)
    .container(containerId)
    .read();
  const { resources: offers } = await client.offers.readAll().fetchAll();

  const newRups = 500;
  for (var offer of offers) {
    if (containerDefinition._rid !== offer.offerResourceId) {
      continue;
    }
    offer.content.offerThroughput = newRups;
    const offerToReplace = client.offer(offer.id);
    await offerToReplace.replace(offer);
    console.log(`Updated offer to ${newRups} RU/s\n`);
    break;
  }
}

/**
 * Create family item if it does not exist
 */
const createItem = async (itemBody) => {
  itemBody.id = uniqid();
  const { item } = await client
    .database(databaseId)
    .container(containerId)
    .items.upsert(itemBody);
  console.log(`Created family item with id:\n${itemBody.id}\n`);
};

/**
 * Query the container using SQL
 */
const queryById = async (id) => {
  console.log(`Querying container:\n${config.container.id}`);

  const querySpec = {
    query: `SELECT VALUE r 
            FROM root r 
            WHERE r.id = @id`,
    parameters: [
      {
        name: "@id",
        value: id,
      },
    ],
  };

  const { resources: results } = await client
    .database(databaseId)
    .container(containerId)
    .items.query(querySpec)
    .fetchAll();

  return results.map(cleanupItem);
};

const cleanupItem = (item) => {
  delete item._rid;
  delete item._etag;
  delete item._self;
  delete item._attachments;
  delete item._ts;
  return item;
};

const queryAll = async (id) => {
  if (cache.isValid) return cache.data;
  console.log(`Querying container:\n${config.container.id}`);

  const querySpec = {
    query: `SELECT VALUE r 
            FROM root r`,
  };

  const { resources: results } = await client
    .database(databaseId)
    .container(containerId)
    .items.query(querySpec)
    .fetchAll();

  const cleanResult = results.map(cleanupItem);
  cache.reset(cleanResult);
  return cleanResult;
};

/**
 * Replace the item by ID.
 */
async function replaceItem(itemBody) {
  console.log(`Replacing item:\n${itemBody.id}\n`);
  // Change property 'grade'
  itemBody.children[0].grade = 6;
  const { item } = await client
    .database(databaseId)
    .container(containerId)
    .item(itemBody.id, itemBody.Country)
    .replace(itemBody);
}

/**
 * Delete the item by ID.
 */
async function deleteItem(itemBody) {
  await client
    .database(databaseId)
    .container(containerId)
    .item(itemBody.id, itemBody.Country)
    .delete(itemBody);
  console.log(`Deleted item:\n${itemBody.id}\n`);
}

/**
 * Cleanup the database and collection on completion
 */
async function cleanup() {
  await client.database(databaseId).delete();
}

/**
 * Exit the app with a prompt
 * @param {string} message - The message to display
 */
function exit(message) {
  console.log(message);
  console.log("Press any key to exit");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", process.exit.bind(process, 0));
}

const setup = async () => {
  try {
    await createDatabase();
    await createContainer();
    await readContainer();
    await scaleContainer();
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  setup,
  createItem,
  queryById,
  queryAll,
};

/*
createDatabase()
  .then(() => readDatabase())
  .then(() => createContainer())
  .then(() => readContainer())
  .then(() => scaleContainer())
//  .then(() => createItem(item))
//   .then(() => createFamilyItem(config.items.Wakefield))
//   .then(() => queryContainer())
//   .then(() => replaceFamilyItem(config.items.Andersen))
//   .then(() => queryContainer())
//   .then(() => deleteFamilyItem(config.items.Andersen))
  .then(() => {
    exit(`Completed successfully`)
  })
  .catch(error => {
    exit(`Completed with error ${JSON.stringify(error)}`)
  })
*/
