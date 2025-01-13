import { Text, Button, Box } from "@shopify/polaris";
export const OrderItem = ({ status, orders }) => {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <Text as="h3" variant="headingMd">
        {status === "DONE"
          ? "KÄSITELTY"
          : status === "PENDING"
            ? "ODOTTAA"
            : "KÄSITTELYSSÄ"}
      </Text>
      <Box
        padding="400"
        background="bg-surface-active"
        borderWidth="025"
        borderRadius="200"
        borderColor="border"
        overflowX="scroll"
      >
        {orders.map((order, index) => (
          <div
            key={index}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text variant="headingLg" as="p">
                  <strong>{order.node.name}</strong>
                </Text>
                <Text variant="bodyMd" as="p">
                  <strong>Sähköposti:</strong>{" "}
                  {order.node.note2?.email || "Ei sähköpostia"}
                </Text>
                <Text variant="bodyMd" as="p">
                  <strong>Yritys:</strong>{" "}
                  {order.node.note2?.company || "Ei yritystä"}
                </Text>
                <Text variant="bodyMd" as="p">
                  <strong>Paikkakunta:</strong>{" "}
                  {order.node.note2?.city || "Ei paikkakuntaa"}
                </Text>
                <Text variant="bodyMd" as="p">
                  <strong>Puhelinnumero:</strong>{" "}
                  {order.node.note2?.phone || "Ei puhelinnumeroa"}
                </Text>
                <Text variant="bodyMd" as="p">
                  <strong>Tiedosto:</strong>{" "}
                  {order.node.note2?.file || "Ei tiedostoa"}
                </Text>
                <Text variant="bodyMd" as="p">
                  <strong>Lisätiedot:</strong>{" "}
                  {order.node.note2?.notes || "Ei lisätietoja"}
                </Text>
              </div>
              <Button primary>Muuta tila</Button>
            </div>

            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginTop: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                padding: "1rem",
              }}
            >
              {order.node.lineItems.edges.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "1rem",
                  }}
                >
                  {item.node.image?.src ? (
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #ddd",
                      }}
                    >
                      <img
                        src={item.node.image.src}
                        alt={item.node.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f4f4f4",
                        color: "#999",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    >
                      Ei kuvaa
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <strong>Tuotteen nimi: {item.node.title}</strong>
                    {/* <strong>
                                        SKU: {item.node.variant.sku}
                                    </strong> */}
                    <strong>Määrä: {item.node.quantity} kpl</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Box>
    </div>
  );
};
