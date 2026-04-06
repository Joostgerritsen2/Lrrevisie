// Categorieën
export const CATEGORIES_QUERY = `
  *[_type == "category"] | order(volgorde asc) {
    _id, naam, naamEn, "slug": slug.current,
    beschrijving, beschrijvingEn, afbeelding,
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`

// Producten per categorie
export const PRODUCTS_BY_CATEGORY_QUERY = `
  *[_type == "product" && categorie->slug.current == $categorie]
  | order(naam asc) {
    _id, naam, naamEn, artikelnummer,
    "slug": slug.current,
    "categorie": categorie->{ naam, "slug": slug.current },
    prijs, saleProijs, inVoorraad,
    "afbeelding": afbeeldingen[0]
  }
`

// Één product
export const PRODUCT_QUERY = `
  *[_type == "product" && slug.current == $slug][0] {
    _id, naam, naamEn, artikelnummer,
    "slug": slug.current,
    "categorie": categorie->{ naam, naamEn, "slug": slug.current },
    prijs, saleProijs, inVoorraad,
    afbeeldingen, beschrijving, beschrijvingEn,
    specificaties, compatibiliteit,
    seoTitle, seoDescription,
    "gerelateerdeProducten": gerelateerdeProducten[]-> {
      _id, naam, artikelnummer, "slug": slug.current,
      prijs, inVoorraad, "afbeelding": afbeeldingen[0],
      "categorie": categorie->{ "slug": slug.current }
    }
  }
`

// Alle product slugs (voor generateStaticParams)
export const ALL_PRODUCT_SLUGS_QUERY = `
  *[_type == "product"] {
    "slug": slug.current,
    "categorie": categorie->slug.current
  }
`

// Alle categorie slugs
export const ALL_CATEGORY_SLUGS_QUERY = `
  *[_type == "category"] { "slug": slug.current }
`

// Settings
export const SETTINGS_QUERY = `*[_type == "settings"][0]`

// Zoeken
export const SEARCH_QUERY = `
  *[_type == "product" && (
    naam match $q + "*" ||
    artikelnummer match $q + "*" ||
    naamEn match $q + "*"
  )] | order(_score desc) [0...20] {
    _id, naam, artikelnummer,
    "slug": slug.current,
    prijs, inVoorraad,
    "afbeelding": afbeeldingen[0],
    "categorie": categorie->{ naam, "slug": slug.current }
  }
`
