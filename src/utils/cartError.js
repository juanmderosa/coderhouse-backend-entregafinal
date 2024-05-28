export const validateCart = (quantity) => {
  if (!quantity || typeof quantity !== "number" || quantity <= 0) {
    return `Error adding your product to the cart.
      Expected arguments:
      - quantity: of type ${typeof quantity} - ${quantity} was received `;
  }
};
