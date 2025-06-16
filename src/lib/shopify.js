// 1. Get your Shopify credentials from the .env file
const storefrontDomain = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontToken = import.meta.env.SHOPIFY_STOREFRONT_API_TOKEN;

// 2. A function to execute queries against the Storefront API
async function shopifyFetch({ query }) {
  // Check if the environment variables are set
  if (!storefrontDomain || !storefrontToken) {
    throw new Error(
      'Shopify environment variables are missing. Please check your .env file and restart the server.'
    );
  }

  const endpoint = `https://${storefrontDomain}/api/2023-10/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API responded with status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;

  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

// 3. A specific function to get all products for getStaticPaths
export async function getAllProducts() {
  const data = await shopifyFetch({
    query: `{
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }`
  });

  return data.products.edges.map(edge => edge.node);
}