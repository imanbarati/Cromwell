[@cromwell/root](../README.md) / [Exports](../modules.md) / [backend](../modules/backend.md) / CreatePost

# Class: CreatePost

[backend](../modules/backend.md).CreatePost

## Hierarchy

- [`BasePageInput`](backend.BasePageInput.md)

  ↳ **`CreatePost`**

## Implements

- `TPostInput`

## Table of contents

### Constructors

- [constructor](backend.CreatePost.md#constructor)

### Properties

- [authorId](backend.CreatePost.md#authorid)
- [content](backend.CreatePost.md#content)
- [delta](backend.CreatePost.md#delta)
- [excerpt](backend.CreatePost.md#excerpt)
- [featured](backend.CreatePost.md#featured)
- [isEnabled](backend.CreatePost.md#isenabled)
- [mainImage](backend.CreatePost.md#mainimage)
- [pageDescription](backend.CreatePost.md#pagedescription)
- [pageTitle](backend.CreatePost.md#pagetitle)
- [publishDate](backend.CreatePost.md#publishdate)
- [published](backend.CreatePost.md#published)
- [readTime](backend.CreatePost.md#readtime)
- [slug](backend.CreatePost.md#slug)
- [tagIds](backend.CreatePost.md#tagids)
- [title](backend.CreatePost.md#title)

## Constructors

### constructor

• **new CreatePost**()

#### Inherited from

[BasePageInput](backend.BasePageInput.md).[constructor](backend.BasePageInput.md#constructor)

## Properties

### authorId

• **authorId**: `string`

#### Implementation of

TPostInput.authorId

#### Defined in

[system/core/backend/src/models/inputs/post.create.ts:12](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/post.create.ts#L12)

___

### content

• **content**: `string`

#### Implementation of

TPostInput.content

#### Defined in

[system/core/backend/src/models/inputs/post.create.ts:24](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/post.create.ts#L24)

___

### delta

• **delta**: `string`

#### Implementation of

TPostInput.delta

#### Defined in

[system/core/backend/src/models/inputs/post.create.ts:27](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/post.create.ts#L27)

___

### excerpt

• `Optional` **excerpt**: ``null`` \| `string`

#### Implementation of

TPostInput.excerpt

#### Defined in

[system/core/backend/src/models/inputs/post.create.ts:30](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/post.create.ts#L30)

___

### featured

• `Optional` **featured**: `boolean`

#### Implementation of

TPostInput.featured

#### Defined in

[system/core/backend/src/models/inputs/post.create.ts:36](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/post.create.ts#L36)

___

### isEnabled

• `Optional` **isEnabled**: `boolean`

#### Implementation of

TPostInput.isEnabled

#### Inherited from

[BasePageInput](backend.BasePageInput.md).[isEnabled](backend.BasePageInput.md#isenabled)

#### Defined in

[system/core/backend/src/models/inputs/base-page.input.ts:16](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/base-page.input.ts#L16)

___

### mainImage

• `Optional` **mainImage**: `string`

#### Implementation of

TPostInput.mainImage

#### Defined in

[system/core/backend/src/models/inputs/post.create.ts:15](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/post.create.ts#L15)

___

### pageDescription

• `Optional` **pageDescription**: `string`

#### Implementation of

TPostInput.pageDescription

#### Inherited from

[BasePageInput](backend.BasePageInput.md).[pageDescription](backend.BasePageInput.md#pagedescription)

#### Defined in

[system/core/backend/src/models/inputs/base-page.input.ts:13](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/base-page.input.ts#L13)

___

### pageTitle

• `Optional` **pageTitle**: `string`

#### Implementation of

TPostInput.pageTitle

#### Inherited from

[BasePageInput](backend.BasePageInput.md).[pageTitle](backend.BasePageInput.md#pagetitle)

#### Defined in

[system/core/backend/src/models/inputs/base-page.input.ts:10](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/base-page.input.ts#L10)

___

### publishDate

• `Optional` **publishDate**: ``null`` \| `Date`

#### Implementation of

TPostInput.publishDate

#### Defined in

[system/core/backend/src/models/inputs/post.create.ts:39](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/post.create.ts#L39)

___

### published

• **published**: `boolean`

#### Implementation of

TPostInput.published

#### Defined in

[system/core/backend/src/models/inputs/post.create.ts:33](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/post.create.ts#L33)

___

### readTime

• `Optional` **readTime**: ``null`` \| `string`

#### Implementation of

TPostInput.readTime

#### Defined in

[system/core/backend/src/models/inputs/post.create.ts:18](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/post.create.ts#L18)

___

### slug

• `Optional` **slug**: `string`

#### Implementation of

TPostInput.slug

#### Inherited from

[BasePageInput](backend.BasePageInput.md).[slug](backend.BasePageInput.md#slug)

#### Defined in

[system/core/backend/src/models/inputs/base-page.input.ts:7](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/base-page.input.ts#L7)

___

### tagIds

• `Optional` **tagIds**: ``null`` \| `string`[]

#### Implementation of

TPostInput.tagIds

#### Defined in

[system/core/backend/src/models/inputs/post.create.ts:21](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/post.create.ts#L21)

___

### title

• **title**: `string`

#### Implementation of

TPostInput.title

#### Defined in

[system/core/backend/src/models/inputs/post.create.ts:9](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/models/inputs/post.create.ts#L9)