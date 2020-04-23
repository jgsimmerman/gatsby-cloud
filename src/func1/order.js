export async function handler({ body }) {
  console.log(`Received from client:`, JSON.parse(body));

  const res = {
    success: true,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
}
