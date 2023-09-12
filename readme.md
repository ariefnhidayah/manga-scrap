# Manga Scrap

Adalah API untuk mengambil data komik berupa manga, manhwa dan manhua berbahasa Indonesia. API ini merupakan web scrapper dari website KomikCast.

## Installation & Run

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Dokumentasi API

#### Get List Komik

```http
  GET /comics
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `page` | `int` | **Optional** |
| `type` | `string` | **Optional**. (manga/manhwa/manhua) |
| `status` | `string` | **Optional**. (Ongoing/Completed) |
| `order` | `string` | **Optional**. (titleasc/titledesc/update/popular) |

#### Get Detail Komik

```http
  GET /comics/${url}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `url`      | `string` | **Required**. URL yang didapatkan dari response API Get List Komik |

#### Get Detail Chapter

```http
  GET /chapter/${url}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `url`      | `string` | **Required**. URL yang didapatkan dari response API Get Detail Komik |

#### Get List Genre

```http
  GET /genres
```

#### Get Detail Genre

```http
  GET /genres/${url}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `url`      | `string` | **Required**. URL yang didapatkan dari response API Get List Genre |

#### Get Search Komik

```http
  GET /search
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `q`      | `string` | **Required**. Keyword komik yang ingin dicari |