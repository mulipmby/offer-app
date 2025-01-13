import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { OrderItem } from "../src/components/OrderItem";

const ADMIN_API = process.env.SHOPIFY_ACCESS_TOKEN;
const endpoint = process.env.SHOPIFY_SHOP_NAME;

export async function adminShopifyFetch({
  cache = "force-cache",
  headers,
  query,
  tags,
  variables,
}) {
  try {
    const result = await fetch(
      `https://${endpoint}/admin/api/2025-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ADMIN_API,
          ...headers,
        },
        body: JSON.stringify({
          ...(query && { query }),
          ...(variables && { variables }),
        }),
        cache,
        ...(tags && { next: { tags } }),
      },
    );

    const body = await result.json();
    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }

    throw {
      error: e,
      query,
    };
  }
}

export const action = async () => {
  try {
    const queryString = `
      query {
        draftOrders(first: 250) {
          edges {
            node {
              name
              id
              email
              tags
              note2
              lineItems(first: 250) {
                edges {
                  node {
                    id
                    title
                    quantity
                    variant {
                      id
                      sku
                    }
                    sku
                    image {
                      id
                      src
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await adminShopifyFetch({
      query: queryString,
      cache: "force-cache",
    });

    const draftOrders = response.body.data.draftOrders.edges;

    const parsedOrders = draftOrders.map((order) => {
      let parsedNote2;
      try {
        parsedNote2 = JSON.parse(order.node.note2);
      } catch {
        parsedNote2 = {};
      }

      return {
        ...order,
        node: {
          ...order.node,
          note2: parsedNote2,
        },
      };
    });
    /* 	console.log(JSON.stringify(parsedOrders, null, 2)); */
    return {
      draftOrders: parsedOrders,
    };
  } catch (e) {
    console.error("Error fetching data:", e);
    return {
      error: e.message || "An error occurred while fetching draft orders",
    };
  }
};

export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    if (fetcher.data?.draftOrders) {
      console.log("Draft Orders fetched successfully");
    }
  }, [fetcher.data, shopify]);

  const fetchOrders = () => fetcher.submit({}, { method: "POST" });

  const categorizeOrders = (orders) => {
    const categorized = { PENDING: [], DONE: [], ONGOING: [] };

    orders.forEach((order) => {
      if (order.node.tags.includes("PENDING")) {
        categorized.PENDING.push(order);
      }
      if (order.node.tags.includes("ONGOING")) {
        categorized.ONGOING.push(order);
      }
      if (order.node.tags.includes("DONE")) {
        categorized.DONE.push(order);
      }
    });

    return categorized;
  };

  return (
    <Page>
      <TitleBar title="Shopify Orders App">
        <Button primary onClick={fetchOrders}>
          Fetch Orders
        </Button>
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Hae kaikki tarjouspyynnöt
                  </Text>
                </BlockStack>
                <InlineStack gap="300">
                  <Button loading={isLoading} onClick={fetchOrders}>
                    Hae tarjouspyynnöt
                  </Button>
                </InlineStack>
                {fetcher.data?.draftOrders && (
                  <>
                    {Object.entries(
                      categorizeOrders(fetcher.data.draftOrders),
                    ).map(([status, orders]) => (
                      <OrderItem key={status} status={status} orders={orders} />
                    ))}
                  </>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
