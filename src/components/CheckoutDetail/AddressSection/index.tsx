'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { MapPin, Plus, Home, Phone } from 'lucide-react'
import { getShippingAddresses } from '@/actions/addresses'
import { ShippingAddress } from '@/payload-types'
import { toast } from 'sonner'
import { useAuth } from '@/providers/AuthProvider'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface AddressModalProps {
  onSelectAddress: (addressId: string) => void
  selectedAddressId: string
}

export default function AddressModal({ onSelectAddress, selectedAddressId }: AddressModalProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [addresses, setAddresses] = useState<ShippingAddress[]>([])

  useEffect(() => {
    if (isOpen && user) {
      getShippingAddresses().then((res) => {
        if (res.success && res.data) {
          setAddresses(res.data)
        } else {
          toast.error(res.message)
        }
      })
    }
  }, [isOpen, user])

  const handleSelectAddress = (value: string) => {
    onSelectAddress(value)
    setIsOpen(false)
  }

  const handleAddNewAddress = () => {
    setIsOpen(false)
    router.push('/account')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-between gap-2 bg-white hover:bg-gray-50 border-gray-300 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            {selectedAddressId && addresses.find((addr) => addr.id === selectedAddressId) ? (
              <span className="truncate">
                {addresses.find((addr) => addr.id === selectedAddressId)?.contactName} -{' '}
                {addresses.find((addr) => addr.id === selectedAddressId)?.detailAddress}
              </span>
            ) : (
              'Chọn địa chỉ giao hàng'
            )}
          </div>
          <span className="text-sm text-gray-500">Chọn</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Chọn Địa Chỉ Giao Hàng
          </DialogTitle>
        </DialogHeader>
        <div className="py-6 max-h-[60vh] overflow-y-auto px-2">
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">Bạn chưa có địa chỉ nào.</p>
            </div>
          ) : (
            <RadioGroup
              value={selectedAddressId}
              onValueChange={handleSelectAddress}
              className="space-y-3"
            >
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={cn(
                    'flex items-start space-x-3 p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow duration-200',
                    selectedAddressId === address.id && 'border-indigo-500 bg-indigo-50',
                  )}
                >
                  <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                  <Label htmlFor={address.id} className="flex-1 cursor-pointer space-y-1">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-800">{address.contactName}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {address.detailAddress}, {address.ward}, {address.district},{' '}
                      {address.province}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{address.contactPhone}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
        <div className="flex justify-between items-center border-t pt-4 px-2">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            Hủy
          </Button>
          <Button
            variant="default"
            onClick={handleAddNewAddress}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Thêm địa chỉ mới
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
