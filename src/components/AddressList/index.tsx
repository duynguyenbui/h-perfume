'use client'

import { ShippingAddress } from '@/payload-types'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '../ui/button'
import { Flag, Plus, Trash2 } from 'lucide-react'
import { useModals } from '@/stores/ModalsStore'
import { ModalType } from '@/constants'
import { deleteAddress, getShippingAddresses } from '@/actions/addresses'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

export const AddressList = () => {
  const { open } = useModals()
  const [addresses, setAddresses] = useState<ShippingAddress[]>([])

  const onDelete = async (addressId: string) => {
    const { success, message } = await deleteAddress(addressId)

    if (success) {
      toast.success('Xóa địa chỉ thành công')
    } else {
      toast.error('Xóa địa chỉ thất bại')
    }
  }

  useEffect(() => {
    getShippingAddresses().then(({ success, message, data }) => {
      if (success) {
        toast.success('Lấy địa chỉ thành công')
        setAddresses(data ?? [])
      } else toast.error('Lấy địa chỉ thất bại')
    })
  }, [])

  return (
    <ScrollArea className="max-w-4xl">
      <Table>
        <TableCaption>
          <Button
            variant="secondary"
            className="flex gap-2"
            onClick={() => open({ modal: ModalType.ADD_ADDRESS })}
          >
            Thêm <Plus className="size-4 ml-2" />
          </Button>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Tên</TableHead>
            <TableHead className="w-[100px]">Tỉnh/TP</TableHead>
            <TableHead className="hidden md:table-cell w-[100px]">Quận/Huyện</TableHead>
            <TableHead className="hidden lg:table-cell w-[100px]">Phường/Xã</TableHead>
            <TableHead className="hidden lg:table-cell w-[150px]">Người nhận</TableHead>
            <TableHead className="w-[120px]">Số điện thoại</TableHead>
            <TableHead className="hidden xl:table-cell">Chi tiết</TableHead>
            <TableHead>
              <Flag className="size-5" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.map((address) => (
            <TableRow key={address.id}>
              <TableCell className="font-medium">
                {(address as any)?.name.split('-')[0]?.trim()}
              </TableCell>
              <TableCell>{address.province}</TableCell>
              <TableCell className="hidden md:table-cell">{address.district}</TableCell>
              <TableCell className="hidden md:table-cell">{address.ward}</TableCell>
              <TableCell className="hidden lg:table-cell">{address.contactName}</TableCell>
              <TableCell>{address.contactPhone}</TableCell>
              <TableCell className="hidden xl:table-cell max-w-[400px] truncate">
                {address.detailAddress}
              </TableCell>
              <TableCell className="flex justify-center" onClick={() => onDelete(address.id)}>
                <Trash2 className="size-4" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}
