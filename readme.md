# Manga Scrap

Adalah API untuk mengambil data komik berupa manga, manhwa dan manhua berbahasa Indonesia. API ini merupakan web scrapper dari website KomikCast.

## Installation & Run

Clone the project

```bash
  git clone https://github.com/ariefnhidayah/manga-scrap
```

Go to the project directory

```bash
  cd manga-scrap
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

```bash
  GET /comics
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `page` | `int` | **Optional** |
| `type` | `string` | **Optional**. (manga/manhwa/manhua) |
| `status` | `string` | **Optional**. (Ongoing/Completed) |
| `order` | `string` | **Optional**. (titleasc/titledesc/update/popular) |

#### Get Detail Komik

```bash
  GET /comics/${url}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `url`      | `string` | **Required**. URL yang didapatkan dari response API Get List Komik |

#### Get Detail Chapter

```bash
  GET /chapter/${url}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `url`      | `string` | **Required**. URL yang didapatkan dari response API Get Detail Komik |

#### Get List Genre

```bash
  GET /genres
```

#### Get Detail Genre

```bash
  GET /genres/${url}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `url`      | `string` | **Required**. URL yang didapatkan dari response API Get List Genre |

#### Get Search Komik

```bash
  GET /search
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `q`      | `string` | **Required**. Keyword komik yang ingin dicari |
