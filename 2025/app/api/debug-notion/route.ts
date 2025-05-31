import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

export async function GET() {
  try {
    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
    })

    const databaseId = process.env.NOTION_DATABASE_ID
    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID não está definido")
    }

    // Obtém metadados do banco de dados
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    })

    // Obtém uma página de amostra
    const pages = await notion.databases.query({
      database_id: databaseId,
      page_size: 1,
    })

    const samplePage = pages.results[0]

    return NextResponse.json({
      success: true,
      database: {
        title: "title" in database ? database.title.map((t: any) => t.plain_text).join("") : "Sem título",
        properties: database.properties
          ? Object.keys(database.properties).map((key) => ({
              name: key,
              type: (database.properties as any)[key].type,
            }))
          : [],
      },
      samplePage: {
        id: samplePage.id,
        propertyNames: "properties" in samplePage ? Object.keys(samplePage.properties) : [],
        titleProperty:
          "properties" in samplePage
            ? Object.entries(samplePage.properties).find(([_, prop]: [string, any]) => prop.type === "title")?.[0] || null
            : null,
      },
    })
  } catch (error) {
    console.error("Erro ao depurar Notion:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
