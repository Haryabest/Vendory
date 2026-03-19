'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { ArrowLeft, MessageCircle, Send, User, Check, CheckCheck, Search, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/shared/ui/loading-spinner';

interface Chat {
  id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  last_message_at?: string;
  seller?: {
    id: string;
    user_id?: string;
    username?: string;
    avatar_url?: string;
  };
  buyer?: {
    id: string;
    username?: string;
    email?: string;
    avatar_url?: string;
  };
  unread_count?: number;
  isOnline?: boolean;
  isTyping?: boolean;
}

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastMessageRef = useRef<string>('');
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const [onlineUsers, setOnlineUsers] = useState(new Set<string>());
  const [typingUsers, setTypingUsers] = useState(new Set<string>());

  // Получаем текущего пользователя
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }
      setCurrentUser(user);
      
      // Запрашиваем разрешение на уведомления
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    };
    getUser();
  }, [router, supabase.auth]);

  // Загружаем чаты пользователя
  useEffect(() => {
    if (!currentUser) return;

    const loadChats = async () => {
      setIsLoading(true);

      try {
        // Чаты где пользователь покупатель
        const { data: buyerChats, error: buyerError } = await supabase
          .from('chats')
          .select('*')
          .eq('buyer_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (buyerError) console.error('Error loading buyer chats:', buyerError);

        // Чаты где пользователь продавец
        const { data: sellerChats, error: sellerError } = await supabase
          .from('chats')
          .select('*')
          .eq('seller_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (sellerError) console.error('Error loading seller chats:', sellerError);

        const allChats = [...(buyerChats || []), ...(sellerChats || [])];
        console.log('Loaded chats:', allChats.length, 'Buyer:', buyerChats?.length, 'Seller:', sellerChats?.length);

        // Загружаем информацию о собеседнике для каждого чата
        const chatsWithDetails = await Promise.all(
          allChats.map(async (chat) => {
            try {
              const sellerId = chat.seller_id;
              const buyerId = chat.buyer_id;
              
              // Загружаем данные продавца
              const { data: sellerData } = await supabase
                .from('sellers')
                .select('id, user_id, username, avatar_url')
                .eq('id', sellerId)
                .single();

              // Загружаем данные покупателя - пробуем из sellers, если нет - используем дефолтные
              let buyerUsername = 'Покупатель';
              let buyerAvatar = null;
              
              try {
                const { data: buyerSellerData, error: buyerError } = await supabase
                  .from('sellers')
                  .select('username, avatar_url')
                  .eq('user_id', buyerId)
                  .single();
                
                if (!buyerError && buyerSellerData) {
                  buyerUsername = buyerSellerData.username || 'Покупатель';
                  buyerAvatar = buyerSellerData.avatar_url;
                }
              } catch (e) {
                // Игнорируем ошибку - у покупателя может не быть seller записи
                console.log('Buyer has no seller record, using defaults');
              }

              // Если у продавца нет username, используем email или ID
              const sellerUsername = sellerData?.username || 'Продавец';
              const sellerAvatar = sellerData?.avatar_url;

              return {
                ...chat,
                seller: {
                  ...sellerData,
                  username: sellerUsername,
                  avatar_url: sellerAvatar,
                },
                buyer: {
                  id: buyerId,
                  username: buyerUsername,
                  avatar_url: buyerAvatar,
                },
                unread_count: 0,
              };
            } catch (error) {
              console.error('Error loading chat details:', error);
              return { ...chat, unread_count: 0 };
            }
          })
        );
        
        console.log('Chats with details:', chatsWithDetails);
        setChats(chatsWithDetails);
        
        // Если чат еще не выбран и есть чаты - выбираем первый
        if (!selectedChat && chatsWithDetails.length > 0) {
          console.log('Auto-selecting first chat');
          setSelectedChat(chatsWithDetails[0]);
        }

        // Проверяем есть ли параметры для создания/открытия чата
        const sellerId = searchParams.get('seller');
        
        if (sellerId) {
          console.log('Looking for chat with seller:', sellerId);
          
          // Ищем существующий чат
          const { data: existingChat, error: findError } = await supabase
            .from('chats')
            .select('*')
            .eq('buyer_id', currentUser.id)
            .eq('seller_id', sellerId)
            .maybeSingle(); // Используем maybeSingle вместо single
          
          console.log('Database search result:', { 
            found: !!existingChat, 
            error: findError 
          });
          
          if (existingChat) {
            // Нашли существующий чат - загружаем детали
            console.log('Found existing chat, loading details...');
            
            // Загружаем данные продавца
            const { data: sellerData } = await supabase
              .from('sellers')
              .select('id, user_id, username, avatar_url')
              .eq('id', existingChat.seller_id)
              .single();
            
            // Загружаем данные покупателя (может не быть в sellers)
            let buyerData = null;
            try {
              const result = await supabase
                .from('sellers')
                .select('id, user_id, username, avatar_url')
                .eq('user_id', existingChat.buyer_id)
                .single();
              buyerData = result.data;
            } catch (e) {
              // У покупателя может не быть seller записи
              console.log('Buyer has no seller record');
            }
            
            const chatWithDetails = {
              ...existingChat,
              seller: sellerData || { id: existingChat.seller_id, username: 'Продавец' },
              buyer: buyerData || { id: existingChat.buyer_id, username: 'Покупатель' },
              unread_count: 0,
            };
            
            console.log('Chat with details:', chatWithDetails);
            setSelectedChat(chatWithDetails);
            
            // Добавляем в список если нет
            if (!chatsWithDetails.find(c => c.id === existingChat.id)) {
              setChats(prev => [chatWithDetails, ...prev]);
            }
          } else {
            console.log('No existing chat found, creating new one...');
            const { data: newChat, error } = await supabase
              .from('chats')
              .insert({ 
                buyer_id: currentUser.id, 
                seller_id: sellerId 
              })
              .select('*')
              .single();
            
            console.log('New chat result:', { newChat, error });
            
            if (newChat && !error) {
              // Загружаем данные продавца
              const { data: sellerData } = await supabase
                .from('sellers')
                .select('id, user_id, username, avatar_url')
                .eq('id', sellerId)
                .single();
              
              // Загружаем данные покупателя (может не быть в sellers)
              let buyerData = null;
              try {
                const result = await supabase
                  .from('sellers')
                  .select('id, user_id, username, avatar_url')
                  .eq('user_id', currentUser.id)
                  .single();
                buyerData = result.data;
              } catch (e) {
                console.log('Buyer has no seller record');
              }

              const newChatWithDetails = {
                ...newChat,
                seller: sellerData || { id: sellerId, username: 'Продавец' },
                buyer: buyerData || { id: currentUser.id, username: 'Покупатель' },
                unread_count: 0,
              };

              console.log('New chat with details:', newChatWithDetails);
              setSelectedChat(newChatWithDetails);
              setChats(prev => [newChatWithDetails, ...prev]);
            } else if (error?.code === '23505') {
              // UNIQUE constraint violation - чат уже создан другим запросом
              console.log('Chat already exists (constraint violation), searching again...');
              // Повторный поиск
              setTimeout(() => window.location.reload(), 500);
            } else {
              console.error('Error creating chat:', error);
            }
          }
          
          window.history.replaceState({}, '', '/chat');
        }
      } catch (error) {
        console.error('Error loading chats:', error);
      }

      setIsLoading(false);
    };

    loadChats();
  }, [currentUser, supabase]);

  // Подписка на новые сообщения и чаты (Realtime)
  useEffect(() => {
    if (!currentUser) return;

    // Инициализируем аудио
    audioRef.current = new Audio('/notification-sound.mp3');

    // Подписка на присутствие пользователей (онлайн статус)
    const presenceChannel = supabase.channel('presence', {
      config: {
        presence: {
          key: currentUser.id,
        },
      },
    });

    presenceChannel.on('presence', { event: 'sync' }, () => {
      const state = presenceChannel.presenceState();
      const onlineIds = new Set(Object.keys(state));
      setOnlineUsers(onlineIds);
    });

    presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await presenceChannel.track({ online: true });
      }
    });

    // Подписка на события "печатает"
    const typingChannel = supabase.channel('typing');
    
    typingChannel.on('broadcast', { event: 'typing' }, (payload) => {
      const { chatId, userId, isTyping } = payload.payload;
      
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(`${chatId}-${userId}`);
        } else {
          newSet.delete(`${chatId}-${userId}`);
        }
        return newSet;
      });
    });

    typingChannel.subscribe();

    // Подписка на новые сообщения
    const messagesChannel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const newMsg = payload.new as Message;
          console.log('New message received:', newMsg);

          // Загружаем информацию о чате если его нет в списке
          setChats(prev => {
            const chatExists = prev.some(c => String(c.id) === String(newMsg.chat_id));
            console.log('Chat exists in list:', chatExists);

            if (!chatExists) {
              console.log('Loading new chat details...');
              // Загружаем информацию о чате
              supabase
                .from('chats')
                .select('*')
                .eq('id', newMsg.chat_id)
                .single()
                .then(async ({ data: chatData }) => {
                  console.log('Loaded chat:', chatData);
                  if (chatData) {
                    // Определяем кто собеседник
                    const otherUserId = String(chatData.buyer_id) === String(currentUser.id)
                      ? chatData.seller_id
                      : chatData.buyer_id;
                    
                    const isBuyerChat = String(chatData.buyer_id) === String(currentUser.id);
                    
                    const [userData] = await Promise.all([
                      isBuyerChat
                        ? supabase.from('sellers').select('id, user_id, username, avatar_url').eq('id', chatData.seller_id).single()
                        : supabase.from('sellers').select('id, user_id, username, avatar_url').eq('user_id', chatData.buyer_id).single(),
                    ]);

                    const newChatWithDetails = {
                      ...chatData,
                      ...(isBuyerChat
                        ? { seller: userData }
                        : { buyer: userData }
                      ),
                      unread_count: String(newMsg.sender_id) !== String(currentUser.id) ? 1 : 0,
                    };

                    setChats(prevChats => {
                      const exists = prevChats.some(c => c.id === newChatWithDetails.id);
                      if (!exists) {
                        return [newChatWithDetails, ...prevChats];
                      }
                      return prevChats;
                    });
                  }
                });
            }

            return prev.map(chat => {
              if (String(chat.id) === String(newMsg.chat_id)) {
                // Если это текущий открытый чат - сбрасываем счетчик
                if (selectedChat && String(chat.id) === String(selectedChat.id)) {
                  return { ...chat, unread_count: 0 };
                }
                // Если сообщение не от нас - увеличиваем счетчик
                if (String(newMsg.sender_id) !== String(currentUser.id)) {
                  return { 
                    ...chat, 
                    unread_count: (chat.unread_count || 0) + 1 
                  };
                }
              }
              return chat;
            });
          });
          
          // Проверяем что сообщение из нашего чата
          if (selectedChat && String(newMsg.chat_id) === String(selectedChat.id)) {
            setMessages((prev) => [...prev, newMsg]);
            scrollToBottom();
            
            // Помечаем как прочитанное если сообщение не от нас
            if (String(newMsg.sender_id) !== String(currentUser.id)) {
              await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('id', newMsg.id);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(presenceChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [selectedChat, currentUser, supabase]);

  // Загрузка сообщений для выбранного чата
  useEffect(() => {
    if (!selectedChat || !currentUser) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', selectedChat.id)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data);
        
        // Помечаем все сообщения как прочитанные
        const unreadMessages = data.filter(
          m => String(m.sender_id) !== String(currentUser.id) && !m.is_read
        );
        
        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadMessages.map(m => m.id));
        }
        
        setTimeout(() => scrollToBottom(), 100);
      }
    };

    loadMessages();
  }, [selectedChat, supabase, currentUser?.id]);

  // Отправка сообщения
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !currentUser) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    // Отправляем что перестали печатать
    if (selectedChat) {
      supabase.channel('typing').send({
        type: 'broadcast',
        event: 'typing',
        payload: { chatId: selectedChat.id, userId: currentUser.id, isTyping: false },
      });
    }

    // Если нет чата, создаем его
    if (!selectedChat.id) {
      const sellerId = searchParams.get('seller');
      if (sellerId) {
        const { data: newChat, error } = await supabase
          .from('chats')
          .insert({ 
            buyer_id: currentUser.id, 
            seller_id: sellerId 
          })
          .select('*')
          .single();
        
        if (newChat && !error) {
          setSelectedChat(newChat);
          // Отправляем сообщение в новый чат
          await supabase.from('messages').insert({
            chat_id: newChat.id,
            sender_id: currentUser.id,
            message: messageText,
            is_read: false,
          });
          return;
        }
      }
    }

    const { error } = await supabase.from('messages').insert({
      chat_id: selectedChat.id,
      sender_id: currentUser.id,
      message: messageText,
      is_read: false,
    });

    if (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageText);
    }
  };

  // Обработка ввода текста
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!selectedChat || !currentUser) return;

    // Отправляем что печатаем
    supabase.channel('typing').send({
      type: 'broadcast',
      event: 'typing',
      payload: { chatId: selectedChat.id, userId: currentUser.id, isTyping: true },
    });

    // Через 2 секунды отправляем что перестали
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      supabase.channel('typing').send({
        type: 'broadcast',
        event: 'typing',
        payload: { chatId: selectedChat.id, userId: currentUser.id, isTyping: false },
      });
    }, 2000);
  };

  // Открытие чата
  const openChat = (chat: Chat) => {
    setSelectedChat(chat);
    setMessages([]);
  };

  // Возврат к списку чатов
  const backToChats = () => {
    setSelectedChat(null);
    setMessages([]);
  };

  // Прокрутка вниз
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Фильтрация чатов
  const filteredChats = chats.filter((chat) => {
    const otherUser = chat.buyer_id === currentUser?.id ? chat.seller : chat.buyer;
    return (
      otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (!currentUser) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Заголовок */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-3xl font-bold">Сообщения</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Список чатов */}
          <Card className="md:col-span-1">
            <CardContent className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск чатов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredChats.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Нет чатов</p>
                    <p className="text-sm mt-2">Напишите продавцу со страницы товара</p>
                  </div>
                ) : (
                  filteredChats.map((chat) => {
                    // Определяем кто собеседник
                    const isBuyer = String(chat.buyer_id) === String(currentUser?.id);
                    const otherUser = isBuyer ? chat.seller : chat.buyer;
                    const otherUserId = isBuyer ? chat.seller_id : chat.buyer_id;
                    const isOnline = onlineUsers.has(String(otherUserId));
                    const unreadCount = chat.unread_count || 0;

                    return (
                      <div
                        key={chat.id}
                        onClick={() => openChat(chat)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                          selectedChat?.id === chat.id
                            ? 'bg-purple-100 border-purple-300'
                            : 'hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {otherUser?.avatar_url ? (
                            <Image
                              src={otherUser.avatar_url}
                              alt={otherUser.username || (isBuyer ? 'Продавец' : 'Покупатель')}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover relative"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold relative">
                              {(otherUser?.username || (isBuyer ? 'П' : 'Б'))[0].toUpperCase()}
                              {isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate flex items-center gap-2">
                                {otherUser?.username || (isBuyer ? 'Продавец' : 'Покупатель')}
                                {isOnline && otherUser?.avatar_url && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                )}
                              </p>
                              {unreadCount > 0 && (
                                <Badge variant="primary" className="text-xs">
                                  {unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm truncate">
                              {typingUsers.has(`${chat.id}-${otherUserId}`) ? (
                                <span className="text-purple-600 italic flex items-center gap-1">
                                  <span className="flex gap-0.5">
                                    <span className="w-1 h-1 bg-purple-600 rounded-full animate-bounce"></span>
                                    <span className="w-1 h-1 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1 h-1 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                  </span>
                                  Печатает...
                                </span>
                              ) : (
                                <span className="text-gray-500">{isBuyer ? 'Продавец' : 'Покупатель'}</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Окно чата */}
          <Card className="md:col-span-2">
            {selectedChat ? (
              <CardContent className="p-0 flex flex-col h-[600px]">
                {/* Шапка чата */}
                <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={backToChats} className="md:hidden">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    {selectedChat.buyer_id === currentUser?.id ? (
                      <>
                        {selectedChat.seller?.avatar_url ? (
                          <div className="relative">
                            <Image
                              src={selectedChat.seller.avatar_url}
                              alt={selectedChat.seller.username || 'Продавец'}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white"
                            />
                            {onlineUsers.has(String(selectedChat.seller_id)) && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold relative">
                            {(selectedChat.seller?.username || 'P')[0].toUpperCase()}
                            {onlineUsers.has(String(selectedChat.seller_id)) && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{selectedChat.seller?.username || 'Продавец'}</p>
                          <p className="text-xs text-gray-600">
                            {typingUsers.has(`${selectedChat.id}-${selectedChat.seller_id}`) ? (
                              <span className="text-purple-600 italic">Печатает...</span>
                            ) : onlineUsers.has(String(selectedChat.seller_id)) ? (
                              <span className="text-green-600">Онлайн</span>
                            ) : (
                              'Офлайн'
                            )}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        {selectedChat.buyer?.avatar_url ? (
                          <div className="relative">
                            <Image
                              src={selectedChat.buyer.avatar_url}
                              alt={selectedChat.buyer.username || 'Покупатель'}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white"
                            />
                            {onlineUsers.has(String(selectedChat.buyer_id)) && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold relative">
                            {(selectedChat.buyer?.username || 'B')[0].toUpperCase()}
                            {onlineUsers.has(String(selectedChat.buyer_id)) && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{selectedChat.buyer?.username || 'Покупатель'}</p>
                          <p className="text-xs text-gray-600">
                            {typingUsers.has(`${selectedChat.id}-${selectedChat.buyer_id}`) ? (
                              <span className="text-purple-600 italic">Печатает...</span>
                            ) : onlineUsers.has(String(selectedChat.buyer_id)) ? (
                              <span className="text-green-600">Онлайн</span>
                            ) : (
                              'Офлайн'
                            )}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Сообщения */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                      <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p className="text-lg">Начните диалог</p>
                      <p className="text-sm mt-2">Сообщения появятся здесь</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                              msg.sender_id === currentUser?.id
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-900 border border-gray-200'
                            }`}
                          >
                            <p className="text-sm break-words">{msg.message}</p>
                            {msg.sender_id === currentUser?.id && (
                              <div className="flex items-center justify-end gap-1 mt-1">
                                {msg.is_read ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Ввод сообщения */}
                <div className="p-4 border-t bg-white rounded-b-xl">
                  <form onSubmit={sendMessage} className="flex gap-2">
                    <Input
                      placeholder="Введите сообщение..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(e);
                        }
                      }}
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      variant="primary" 
                      disabled={!newMessage.trim() || isLoading}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </CardContent>
            ) : (
              <CardContent className="flex items-center justify-center h-[600px]">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">Выберите чат для начала общения</p>
                  <p className="text-sm mt-2">Или напишите продавцу со страницы товара</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
