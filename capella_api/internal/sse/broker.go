package sse

type Broker struct {
	notifier      chan NotifierEvent
	newClient     chan eventReceiver
	closingClient chan eventReceiver
	clients       map[string]map[string]chan []byte // this map is basically map[userId, map[tabId, message channel]]
}

type eventReceiver struct {
	UserID   string // actual userId
	ID       string // id is the unique id for each specific instance(tab) of that user
	Messages chan []byte
}

type NotifierEvent struct {
	UserID   string
	Message  []byte
}

func New() *Broker {
	return &Broker{
		notifier:      make(chan NotifierEvent, 1),
		newClient:     make(chan eventReceiver),
		closingClient: make(chan eventReceiver),
		clients:       make(map[string]map[string]chan []byte),
	}
}

func (b *Broker) NewClient(id, userId string, messages chan []byte) {
	b.newClient <- eventReceiver{
		UserID:   userId,
		ID:       id,
		Messages: messages,
	}
}

func (b *Broker) CloseClient(id, userId string) {
	b.closingClient <- eventReceiver{
		UserID: userId,
		ID:     id,
	}
}

func (b *Broker) Run() {
	go b.listen()
}

func (b *Broker) Publish(userId string, message []byte) {
	b.notifier <- NotifierEvent{
		UserID: userId,
		Message: message,
	}
}

func (b *Broker) listen() {
	for {
		select {
		case nc := <-b.newClient:
			// if the userId is not there in map
			if _, ok := b.clients[nc.UserID]; !ok {
				b.clients[nc.UserID] = make(map[string]chan []byte)
			}

			// add the client id to the map and register their message channel
			if _, ok := b.clients[nc.UserID][nc.ID]; !ok {
				b.clients[nc.UserID][nc.ID] = nc.Messages
			}
		case cc := <-b.closingClient:
			// remove the id first
			if cuid, ok := b.clients[cc.UserID]; ok {
				delete(cuid, cc.ID)
				// if no more clients for a particular userId exists
				if len(cuid) == 0 {
					// remove that userId
					delete(b.clients, cc.UserID)
				}
			}

		case notif := <-b.notifier:
			// if the userId (for which there is a notification) exists in the map
			if cuid, ok := b.clients[notif.UserID]; ok {
				// push the message to respective msg channels of the corresponding tab ids
				for _, channel := range cuid {
					select {
					case channel <- notif.Message:
					default:
						// drop the message if client is slow
					}
				}
			}
		}
	}
}
