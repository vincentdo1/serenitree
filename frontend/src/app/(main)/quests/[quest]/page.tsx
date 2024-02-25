import { cache } from 'react'
import { notFound } from 'next/navigation'

import { Container } from '@/components/Container'
import { FormattedDate } from '@/components/FormattedDate'
import { getAllReflections } from '@/lib/reflections'

const getReflections = cache(async (id) => {
  console.log('getReflections: id:', id)
  let reflections = await getAllReflections(id)
  if (!reflections) {
    notFound()
  }
  return reflections
})

export default async function Reflection({
  params: { quest_id },
}: {
  params: { quest_id }
}) {
  console.log('reflections: quest_id:', quest_id);
  let reflection = await getReflections(quest_id)
  let date = new Date(reflection.message)

  return (
    <article className="py-16 lg:py-36">
      <Container>
        <header className="flex flex-col">
          <div className="flex items-center gap-6">
            
            <div className="flex flex-col">
              <h1 className="mt-2 text-4xl font-bold text-slate-900">
                {reflection.message}
              </h1>
              <FormattedDate
                date={date}
                className="order-first font-mono text-sm leading-7 text-slate-500"
              />
            </div>
          </div>
          <p className="ml-24 mt-3 text-lg font-medium leading-8 text-slate-700">
            {reflection.message}
          </p>
        </header>
        <hr className="my-12 border-gray-200" />
        <div
          className="prose prose-slate mt-14 [&>h2:nth-of-type(3n)]:before:bg-violet-200 [&>h2:nth-of-type(3n+2)]:before:bg-indigo-200 [&>h2]:mt-12 [&>h2]:flex [&>h2]:items-center [&>h2]:font-mono [&>h2]:text-sm [&>h2]:font-medium [&>h2]:leading-7 [&>h2]:text-slate-900 [&>h2]:before:mr-3 [&>h2]:before:h-3 [&>h2]:before:w-1.5 [&>h2]:before:rounded-r-full [&>h2]:before:bg-cyan-200 [&>ul]:mt-6 [&>ul]:list-['\2013\20'] [&>ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: reflection.message }}
        />
      </Container>
    </article>
  )
}
