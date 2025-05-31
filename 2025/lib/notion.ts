import { Client } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"

// Inicializa o cliente do Notion com variáveis de ambiente
const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
})

// Inicializa o conversor NotionToMarkdown
const n2m = new NotionToMarkdown({ notionClient })

// Define a interface BlogPost
export interface BlogPost {
  id: string
  title: string
  slug: string
  coverImage: string
  excerpt: string
  date: string
  author: {
    name: string
    avatar: string
  }
  tags: string[]
  content?: string
}

// Função auxiliar para formatar uma página do Notion em um post de blog
async function formatPost(page: any): Promise<BlogPost> {
  const properties = page.properties

  // No Notion, a propriedade de título pode ter nomes diferentes
  // Vamos tentar encontrá-la verificando propriedades do tipo 'title'
  let title = "Sem título"

  // Primeiro, verifica se há uma propriedade do tipo 'title'
  for (const [key, value] of Object.entries(properties)) {
    if ((value as any).type === "title" && (value as any).title?.length > 0) {
      title = (value as any).title[0].plain_text
      break
    }
  }

  // Se ainda não temos um título, tente nomes comuns de propriedades
  if (title === "Sem título") {
    const possibleTitleProps = ["Name", "Title", "Título", "Nome"]
    for (const propName of possibleTitleProps) {
      if (properties[propName]?.title?.[0]?.plain_text) {
        title = properties[propName].title[0].plain_text
        break
      }
    }
  }

  // Use a propriedade Slug se existir, caso contrário, gere a partir do ID da página
  let slug = ""
  // Tenta encontrar uma propriedade de slug
  const slugProps = ["Slug", "slug", "URL", "url", "Link", "link"]
  for (const propName of slugProps) {
    if (properties[propName]?.rich_text?.[0]?.plain_text) {
      slug = properties[propName].rich_text[0].plain_text
      break
    }
  }

  // Se nenhum slug for encontrado, use o ID da página
  if (!slug) {
    slug = page.id.replace(/-/g, "")
  }

  // Obtém a data da propriedade "Publicação" ou outras propriedades de data
  let date = ""
  // Tenta encontrar uma propriedade de data
  const dateProps = ["Publicação", "Date", "data", "Data", "Published", "Created"]
  for (const propName of dateProps) {
    if (properties[propName]?.date?.start) {
      date = properties[propName].date.start
      break
    }
  }
  // Se nenhuma data for encontrada, use a hora de criação da página
  if (!date) {
    date = page.created_time
  }

  // Obtém o resumo da propriedade "Resumo do post" ou outras propriedades de texto
  let excerpt = ""
  // Tenta encontrar uma propriedade de resumo
  const excerptProps = ["Resumo do post", "Excerpt", "Summary", "Description", "Descrição"]
  for (const propName of excerptProps) {
    if (properties[propName]?.rich_text?.[0]?.plain_text) {
      excerpt = properties[propName].rich_text[0].plain_text
      break
    }
  }

  // Obtém informações do autor
  let authorName = "Anônimo"
  let authorAvatar = ""
  // Tenta encontrar propriedades de autor
  const authorProps = ["Autor", "Author", "Creator", "Criador"]
  for (const propName of authorProps) {
    if (properties[propName]?.people?.[0]?.name) {
      authorName = properties[propName].people[0].name
      authorAvatar = properties[propName].people[0].avatar_url || ""
      break
    } else if (properties[propName]?.rich_text?.[0]?.plain_text) {
      authorName = properties[propName].rich_text[0].plain_text
      break
    }
  }

  // Extração aprimorada de imagem de capa
  let coverImage = ""

  // 1. Verifica a capa da página (mais comum no Notion)
  if (page.cover) {
    if (page.cover.type === "external") {
      coverImage = page.cover.external.url
    } else if (page.cover.type === "file") {
      coverImage = page.cover.file.url
    }
  }

  // 2. Se não houver capa de página, verifique uma propriedade de imagem de capa
  if (!coverImage) {
    const coverProps = ["Cover", "CoverImage", "Cover Image", "Capa", "Imagem de Capa"]
    for (const propName of coverProps) {
      if (properties[propName]?.files?.[0]) {
        const file = properties[propName].files[0]
        if (file.type === "external") {
          coverImage = file.external.url
        } else if (file.type === "file") {
          coverImage = file.file.url
        }
        break
      } else if (properties[propName]?.url) {
        coverImage = properties[propName].url
        break
      }
    }
  }

  // Obtém tags da propriedade "Tags"
  let tags: string[] = []
  const tagProps = ["Tags", "Tag", "Categories", "Category", "Categorias", "Categoria"]
  for (const propName of tagProps) {
    if (properties[propName]?.multi_select) {
      tags = properties[propName].multi_select.map((tag: any) => tag.name)
      break
    }
  }

  return {
    id: page.id,
    title,
    slug,
    coverImage,
    excerpt,
    date,
    author: {
      name: authorName,
      avatar: authorAvatar,
    },
    tags,
  }
}

// Função auxiliar para criar um filtro de publicação com base no esquema do banco de dados
async function createPublishedFilter(databaseId: string) {
  try {
    // Obtém o esquema do banco de dados para verificar as propriedades disponíveis
    const database = await notionClient.databases.retrieve({
      database_id: databaseId,
    })

    const properties = database.properties
    const propertyNames = Object.keys(properties)

    // Verifica propriedades semelhantes a status
    const statusProps = ["Status", "status", "Published", "Publicado", "Estado"]
    let statusProperty = null

    for (const propName of statusProps) {
      if (propertyNames.includes(propName)) {
        statusProperty = propName
        const propertyType = properties[propName].type

        // Cria filtro apropriado com base no tipo de propriedade
        if (propertyType === "status") {
          return {
            property: statusProperty,
            status: {
              equals: "Publicado",
            },
          }
        } else if (propertyType === "select") {
          return {
            property: statusProperty,
            select: {
              equals: "Publicado",
            },
          }
        } else if (propertyType === "checkbox") {
          return {
            property: statusProperty,
            checkbox: {
              equals: true,
            },
          }
        }
      }
    }

    // Se nenhuma propriedade de status for encontrada, retorna null (sem filtro)
    console.log("Nenhuma propriedade de status encontrada no banco de dados")
    return null
  } catch (error) {
    console.error("Erro ao criar filtro de publicação:", error)
    return null
  }
}

// Função para buscar posts do Notion
export async function getPosts(pageSize: number, startCursor?: string) {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.warn("Chaves do Notion não estão definidas")
    return { posts: [], nextCursor: null, hasMore: false }
  }

  try {
    const databaseId = process.env.NOTION_DATABASE_ID

    // Cria um filtro para posts publicados
    const publishedFilter = await createPublishedFilter(databaseId)

    // Prepara parâmetros de consulta
    const queryParams: any = {
      database_id: databaseId,
      page_size: pageSize,
      start_cursor: startCursor,
    }

    // Adiciona filtro se disponível
    if (publishedFilter) {
      queryParams.filter = publishedFilter
    }

    const response = await notionClient.databases.query(queryParams)

    const posts = await Promise.all(response.results.map(formatPost))

    return {
      posts,
      nextCursor: response.has_more ? response.next_cursor : null,
      hasMore: response.has_more,
    }
  } catch (error) {
    console.error("Erro ao buscar posts do Notion:", error)
    return { posts: [], nextCursor: null, hasMore: false }
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.warn("Chaves do Notion não estão definidas")
    return null
  }

  try {
    console.log(`Buscando post com slug: ${slug}`)
    const databaseId = process.env.NOTION_DATABASE_ID

    // Primeiro, obtém o esquema do banco de dados para verificar as propriedades disponíveis
    const database = await notionClient.databases.retrieve({
      database_id: databaseId,
    })

    const properties = database.properties
    const propertyNames = Object.keys(properties)
    console.log("Propriedades disponíveis:", propertyNames)

    // Verifica se temos uma propriedade semelhante a slug
    let slugProperty = null
    const slugProps = ["Slug", "slug", "URL", "url", "Link", "link"]
    for (const propName of slugProps) {
      if (propertyNames.includes(propName)) {
        slugProperty = propName
        break
      }
    }

    // Cria um filtro para posts publicados
    const publishedFilter = await createPublishedFilter(databaseId)

    let response

    // Se encontramos uma propriedade de slug, tente consultar por ela
    if (slugProperty) {
      console.log(`Usando propriedade "${slugProperty}" para buscar slug`)

      const filter: any = {
        and: [
          {
            property: slugProperty,
            rich_text: {
              equals: slug,
            },
          },
        ],
      }

      // Adiciona filtro de publicação se disponível
      if (publishedFilter) {
        filter.and.push(publishedFilter)
      }

      response = await notionClient.databases.query({
        database_id: databaseId,
        filter: filter,
      })
    } else {
      console.log("Nenhuma propriedade de slug encontrada no banco de dados, buscando todas as páginas publicadas")

      // Se nenhuma propriedade de slug existir, busque todas as páginas publicadas e filtre manualmente
      const queryParams: any = {
        database_id: databaseId,
        page_size: 100,
      }

      // Adiciona filtro de publicação se disponível
      if (publishedFilter) {
        queryParams.filter = publishedFilter
      }

      response = await notionClient.databases.query(queryParams)
    }

    // Se não encontramos uma correspondência pela propriedade slug ou não tínhamos uma propriedade slug,
    // tente corresponder pelo ID da página
    if (response.results.length === 0 || !slugProperty) {
      console.log("Tentando corresponder pelo ID da página")

      // Se já buscamos todas as páginas, use esse resultado
      const pagesToSearch =
        response.results.length > 0
          ? response.results
          : (
              await notionClient.databases.query({
                database_id: databaseId,
                page_size: 100,
                filter: publishedFilter || undefined,
              })
            ).results

      // Encontra uma página com ID correspondente
      const matchingPage = pagesToSearch.find((page) => {
        const pageId = page.id.replace(/-/g, "")
        return pageId === slug || page.id === slug
      })

      if (matchingPage) {
        console.log(`Página correspondente encontrada pelo ID: ${matchingPage.id}`)
        response = { results: [matchingPage] }
      } else {
        console.log("Nenhuma página correspondente encontrada pelo ID")
      }
    }

    if (response.results.length === 0) {
      console.log("Nenhum post encontrado com o slug ou ID fornecido")
      return null
    }

    const page = response.results[0]
    console.log(`Post encontrado com ID: ${page.id}`)

    const post = await formatPost(page)

    // Busca blocos de conteúdo
    const mdBlocks = await n2m.pageToMarkdown(page.id)
    const markdown = n2m.toMarkdownString(mdBlocks)

    return {
      ...post,
      content: markdown.parent,
    }
  } catch (error) {
    console.error("Erro ao buscar post por slug:", error)
    return null
  }
}
