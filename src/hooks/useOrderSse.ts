// Removed unused useEffect import

interface OrderEvent {
  type: string;
  orderId?: string;
  totalAmount?: number;
  message?: string;
}
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; 
export const subscribeOrderSSE = (
  userId: string,
  onMessage: (event: OrderEvent) => void,
  onComplete: () => void
) => {
  const eventSource = new EventSource(`${baseUrl}/api/sse/orders/stream?userId=${userId}`)

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as OrderEvent;
      onMessage(data);

      // close the connection once final state is reached
      if (["ORDER_CREATED", "ORDER_FAILED"].includes(data.type)) {
        eventSource.close();
        onComplete();
      }
    } catch (err: unknown) {
      console.error("Invalid SSE event:", event.data, err);
    }
  };

  eventSource.onerror = (err: Event) => {
    console.error("SSE connection error:", err);
    eventSource.close();
  };

  return eventSource;
};
