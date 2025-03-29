'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon, LinkIcon, Scissors, Send, X } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

import { CHAT_KEY, MAX_ATTACHMENTS } from '@/constants'
import { Loader } from '@/components/Loader'
import SocketIndicator from '@/components/SocketIndicator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Form, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useChatQuery } from '@/hooks/useChatQuery'
import { useAuth } from '@/providers/AuthProvider'
import { useSocket } from '@/providers/SocketProvider'
import type { Conversation, Message } from '@/payload-types'
import { PayloadMessageValidator, type TPayloadMessageValidator } from '@/validations'
import ReactMarkdown from 'react-markdown'
import { ImageMessage } from '@/components/ImageMessage'
import axios from 'axios'
interface ChatProps {
  conversation: Conversation
}

export function Chat({ conversation }: ChatProps) {
  const { user: currentUser } = useAuth()
  const { isConnected, socket } = useSocket()
  const { messages: serverMessages, isLoading, error } = useChatQuery()

  const chatKey = `${CHAT_KEY}:${conversation.id}`

  const [linkUrl, setLinkUrl] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [attachments, setAttachments] = useState<File[]>([])
  const [showAttachmentsDialog, setShowAttachmentsDialog] = useState(false)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)

  const form = useForm<TPayloadMessageValidator>({
    resolver: zodResolver(PayloadMessageValidator),
    defaultValues: {
      conversationId: conversation.id,
      content: '',
      attachments: [],
      role: currentUser?.roles?.includes('admin') ? 'Admin' : 'User',
    },
  })

  const { isSubmitting } = form.formState

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (attachments.length >= MAX_ATTACHMENTS) {
      toast.error('Bạn chỉ có thể tải lên tối đa 3 tệp đính kèm')
      return
    }

    const files = e.target.files

    if (files?.length) {
      const newAttachments = Array.from(files)
      setAttachments((prev) => [...prev, ...newAttachments])
      form.setValue('attachments', [...(form.getValues('attachments') || []), ...newAttachments])
    }
  }

  const onCut = () => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart
      const end = inputRef.current.selectionEnd
      const content = form.getValues('content')

      if (start !== null && end !== null && start !== end && content) {
        navigator.clipboard.writeText(content.slice(start, end))
        const newText = content.slice(0, start) + content.slice(end)
        form.setValue('content', newText)
      }
    }
  }

  const onLinkInsert = () => {
    const content = form.getValues('content')

    if (linkUrl) {
      const newText = content + ` [Link](${linkUrl})`
      form.setValue('content', newText)
      setLinkUrl('')
      setIsLinkDialogOpen(false)
    }
  }

  const onAttachmentRemove = (attachment: File) => {
    const filtered = (prev: File[]) => prev.filter((a) => a.name !== attachment.name)
    setAttachments(filtered)
    form.setValue('attachments', filtered(form.getValues('attachments') || []))
  }

  const onSubmit = async (values: TPayloadMessageValidator) => {
    console.log('values', values)

    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để gửi tin nhắn')
      return
    }

    const { success, data } = PayloadMessageValidator.safeParse(values)

    if (!success) {
      toast.error('Vui lòng điền đầy đủ các trường')
      return
    }

    const { content, attachments } = data

    if (!content && !attachments.length) {
      toast.error('Nội dung hoặc tệp đính kèm là bắt buộc')
      return
    }

    const formData = new FormData()

    formData.append('conversationId', conversation.id)
    formData.append('role', data.role)
    if (data.content) {
      formData.append('content', data.content)
    }
    if (data.attachments && data.attachments.length > 0) {
      for (const file of data.attachments) {
        formData.append('attachments', file, file.name)
      }
    }

    axios
      .post('/api/socket/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        toast.success(res.data.message)
      })
      .catch((err) => {
        toast.error(err.response.data.message)
      })

    setAttachments([])
    setLinkUrl('')
    setIsLinkDialogOpen(false)
    setShowAttachmentsDialog(false)

    form.setValue('content', '')
    form.setValue('attachments', [])

    inputRef.current?.focus()
  }

  // side effects
  useEffect(() => {
    if (isConnected) {
      socket?.on(chatKey, (message: any) => {
        setMessages((prev) => [...prev, message])
      })
    }
    return () => {
      socket?.off(chatKey)
    }
  }, [isConnected, socket, chatKey])

  useEffect(() => {
    if (serverMessages) {
      setMessages(serverMessages)
    }
  }, [serverMessages])

  useEffect(() => {
    setTimeout(scrollToBottom, 1000)
  }, [messages, serverMessages])

  return (
    <div className="flex h-[calc(100vh-6rem)] mx-auto max-w-4xl">
      <div className="flex-1 flex flex-col bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <span>{conversation.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <SocketIndicator />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {!isLoading &&
            messages?.map((message, index) => {
              const isAdmin = message.role === 'Admin'
              const isCurrentUser = (message.sender as any)?.id === currentUser?.id
              const otherUser = isCurrentUser ? currentUser : message.sender

              const shouldShowOnRight = isCurrentUser

              const senderName = isCurrentUser
                ? 'Bạn'
                : isAdmin
                  ? `[Admin] ${(otherUser as any)?.name || ''}`
                  : otherUser
                    ? (otherUser as any)?.name || 'Unknown'
                    : 'Unknown'

              const senderId = (message.sender as any)?.id || 'Unknown'

              return (
                <div
                  key={index}
                  className={`flex ${shouldShowOnRight ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <Card
                    className={cn(
                      'p-4 max-w-[80%]',
                      shouldShowOnRight
                        ? isAdmin
                          ? 'bg-rose-100 dark:bg-rose-900'
                          : 'bg-amber-100 dark:bg-amber-900'
                        : isAdmin
                          ? 'bg-rose-100 dark:bg-rose-900'
                          : 'bg-purple-100 dark:bg-purple-900',
                    )}
                  >
                    <div
                      className={`flex gap-4 ${shouldShowOnRight ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={cn(
                          'h-8 w-8 rounded-full flex items-center justify-center text-white',
                          isAdmin ? 'bg-rose-500' : 'bg-amber-500',
                        )}
                      >
                        {(isCurrentUser ? currentUser?.name?.charAt(0) : isAdmin ? 'A' : 'U') ||
                          'N/A'}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground mb-1">
                          {senderName}
                          {isAdmin && !isCurrentUser ? ` #${senderId}` : ''}
                        </div>
                        <div className="text-foreground">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        {message.attachments &&
                          message.attachments.length > 0 &&
                          message.attachments.map((attachment) => (
                            <div key={attachment.id} className="mt-2">
                              <ImageMessage media={(attachment as any).media} />
                            </div>
                          ))}
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })}
          <div ref={messagesEndRef} />
          {(isLoading || error) && <Loader className="text-rose-500" />}
        </div>

        <div className="p-4 border-t mb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <Input
                      disabled={isLoading || isSubmitting}
                      ref={inputRef}
                      className="w-full"
                      placeholder="Nhập câu hỏi của bạn..."
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center flex-wrap">
                    <div className="flex gap-3">
                      <Button
                        disabled={isLoading || isSubmitting}
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        disabled={isLoading || isSubmitting}
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsLinkDialogOpen(true)}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onCut}
                        disabled={isLoading || isSubmitting}
                      >
                        <Scissors className="h-4 w-4" />
                      </Button>
                    </div>

                    {attachments.length > 0 && (
                      <>
                        <div className="flex flex-wrap gap-2 max-w-[200px] overflow-hidden">
                          {attachments.length <= 1 ? (
                            attachments.map((attachment) => (
                              <Badge
                                key={attachment.name}
                                variant="outline"
                                className="flex items-center gap-1 max-w-full truncate"
                              >
                                <span className="truncate">{attachment.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0"
                                  onClick={() => onAttachmentRemove(attachment)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))
                          ) : (
                            <>
                              <Badge
                                key={attachments[0].name}
                                variant="outline"
                                className="flex items-center gap-1 max-w-full truncate"
                              >
                                <span className="truncate">{attachments[0].name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0"
                                  onClick={() => onAttachmentRemove(attachments[0])}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                              <Badge
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => setShowAttachmentsDialog(true)}
                              >
                                +{attachments.length - 1} tệp đính kèm khác
                              </Badge>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Input
                type="file"
                ref={imageInputRef}
                className="hidden"
                onChange={onImageUpload}
                accept="image/*"
              />
            </form>
          </Form>
        </div>

        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chèn liên kết</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="Vui lòng nhập URL"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsLinkDialogOpen(false)}>
                Hủy bỏ
              </Button>
              <Button type="button" onClick={onLinkInsert}>
                Xác nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showAttachmentsDialog} onOpenChange={setShowAttachmentsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tệp đính kèm</DialogTitle>
              <DialogDescription>Bạn có thể xóa tệp đính kèm bất kỳ lúc nào</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[300px] overflow-y-auto">
              {attachments.map((attachment) => (
                <div key={attachment.name} className="flex items-center justify-between">
                  <span className="truncate">{attachment.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onAttachmentRemove(attachment)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => setShowAttachmentsDialog(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
