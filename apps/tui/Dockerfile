FROM golang:1.26.2-alpine3.23

WORKDIR /app

COPY go.mod go.mod

COPY go.sum go.sum

RUN go mod tidy

COPY . .

CMD ["go", "run", "."]
