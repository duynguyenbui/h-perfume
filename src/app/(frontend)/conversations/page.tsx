import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'
import { redirect } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default async function Page() {
  const { user: currentUser } = await getServerSideUser()

  if (!currentUser) {
    redirect('/login')
  }

  const client = await getPayloadClient()

  const { docs: userConversations } = await client.find({
    collection: 'conversations',
    depth: 0,
    where: {
      participants: {
        contains: currentUser.id,
      },
    },
  })

  const userConversation = userConversations[0] ?? undefined

  if (userConversation && !currentUser.roles.includes('admin')) {
    redirect(`/conversations/${userConversation.id}`)
  }

  if (!userConversation && !currentUser.roles.includes('admin')) {
    const newConversation = await client.create({
      collection: 'conversations',
      data: {
        participants: [currentUser],
        name: `#Hỗ trợ - ${currentUser.name}`,
      },
    })

    if (newConversation) {
      redirect(`/conversations/${newConversation.id}`)
    }
  }

  const { docs: adminConversations, totalDocs: totalAdminConversations } = await client.find({
    collection: 'conversations',
    depth: 1,
  })

  return (
    <div className="mt-10 sm:max-w-2xl md:max-w-5xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Hỗ trợ</h1>
        <h2 className="text-sm text-gray-500">Danh sách cuộc hội thoại cần hỗ trợ</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Danh sách cuộc hội thoại cần hỗ trợ</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[100px]">Tên cuộc hội thoại</TableHead>
              <TableHead className="min-w-[150px]">Tên khách hàng</TableHead>
              <TableHead className="min-w-[100px]">Trạng thái</TableHead>
              <TableHead className="text-right min-w-[120px]">Ngày tạo</TableHead>
              <TableHead className="text-right min-w-[100px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminConversations.map((conversation) => {
              const customer = (conversation.participants as any[]).find(
                (participant) => !participant.roles.includes('admin'),
              )?.name

              const status = (conversation.participants as any[]).some(
                (participant) => participant.roles.includes('admin'),
              )
                ? 'Đã hỗ trợ'
                : 'Chưa hỗ trợ'

              const createdAt = new Date(conversation.createdAt).toISOString()

              return (
                <TableRow key={conversation.id}>
                  <TableCell className="break-all">{conversation.name}</TableCell>
                  <TableCell className="text-left break-all">{customer}</TableCell>
                  <TableCell
                    className={cn(status === 'Đã hỗ trợ' ? 'text-green-500' : 'text-red-500')}
                  >
                    {status}
                  </TableCell>
                  <TableCell className="text-right">{createdAt}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/conversations/${conversation.id}`}>
                      <Button variant="default" className="w-full sm:w-auto">
                        Hỗ trợ
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Tổng số cuộc hội thoại</TableCell>
              <TableCell className="text-right">{totalAdminConversations}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
