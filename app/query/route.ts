// 에러출력을 위해 2줄 추가(by SC)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import postgres from "postgres";

// Supabase 프로젝트의 DB URL 환경변수 사용
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
  // prepare: false, // <= prepared statements 끄기 추가(by SC)
});

// 원본 코드
// async function listInvoices() {
//   const data = await sql`
//     SELECT invoices.amount, customers.name
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE invoices.amount >= 100;
//     -- WHERE invoices.amount = 666; <== 실제 예제쿼리 (by SC)
//     -- LIMIT 5; <== 테스트용으로 걸어본 쿼리 (by SC)
//   `;

//   return data;
// }

// // /query 라우트에서 GET 요청이 오면 DB 쿼리 실행후 JSON 반환
// export async function GET() {
//   try {
//     return Response.json(await listInvoices());
//   } catch (error) {
//     console.error(error); // 에러 로그 추가(by SC)
//     return Response.json({ error: String(error) }, { status: 500 });
//   }
// }

// 테스트 코드
async function listInvoices() {
  const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount >= 100
    LIMIT 5;
  `;
  return data;
}
// 💡 데이터 분포 확인용 쿼리
async function listAmounts() {
  const amounts = await sql`
    SELECT DISTINCT amount
    FROM invoices
    ORDER BY amount
    LIMIT 20;
  `;
  return amounts;
}

export async function GET() {
  try {
    const invoices = await listInvoices(); // 조건 걸린 데이터
    const amounts = await listAmounts(); // 금액 분포 확인

    return Response.json({
      invoices,
      sampleAmounts: amounts,
    });
  } catch (error) {
    console.error(error);
    return new Response("ERR: " + String(error), { status: 500 });
  }
}
