import { TAttributeInput, TProduct, TPost, TProductCategoryInput, TProductReview, TProductReviewInput, TUserInput } from '@cromwell/core';
import {
    AttributeRepository,
    ProductCategoryRepository,
    ProductRepository,
    ProductReviewRepository,
    PostRepository,
    UserRepository
} from '@cromwell/core-backend';
import { Injectable } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import nameGenerator from 'project-name-generator';

@Injectable()
export class MockService {

    private productRepo = getCustomRepository(ProductRepository);
    private productCategoryRepo = getCustomRepository(ProductCategoryRepository);
    private attributeRepo = getCustomRepository(AttributeRepository);
    private productReviewRepo = getCustomRepository(ProductReviewRepository);
    private postRepo = getCustomRepository(PostRepository);
    private userRepo = getCustomRepository(UserRepository);

    private shuffleArray = <T extends Array<any>>(array: T): T => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // attributes
    private attributesMock: TAttributeInput[] = [{
        key: "Size",
        values: [{ value: "35" }, { value: "36" }, { value: "37" }, { value: "38" }, { value: "39" }, { value: "40" }, { value: "41" }, { value: "42" }, { value: "43" }, { value: "44" }, { value: "45" }],
        type: 'radio'
    },
    {
        key: 'Color',
        values: [{ value: "Orange", icon: '/plugins/@cromwell/plugin-product-filter/color_orange.png' },
        { value: "Purple", icon: '/plugins/@cromwell/plugin-product-filter/color_purple.png' },
        { value: "Blue", icon: '/plugins/@cromwell/plugin-product-filter/color_blue.png' }],
        type: 'radio'
    },
    {
        key: 'Condition',
        values: [{ value: "New" }, { value: "Used" }],
        type: 'radio'
    }];

    // reviews
    private reviewsMock: (Omit<TProductReviewInput, 'productId'>)[] = [
        {
            title: 'Just awesome',
            description: 'Best product ever!!!',
            rating: 5,
            userName: 'Kevin',
        },
        {
            title: 'All good',
            description: 'Satisfied on 99%',
            rating: 4.5,
            userName: 'Jim',
        },
        {
            title: 'Nothing special',
            description: "You can go with it, but I'm good",
            rating: 4,
            userName: 'Dwight',
        },
        {
            title: 'Not bad',
            description: "To be honest it could be worse but well it wasn't",
            rating: 3.5,
            userName: 'Tobby',
        },
        {
            title: 'Could be better',
            description: "Actually, for the record, it is NOT good",
            rating: 3,
            userName: 'Oscar',
        },
        {
            title: '',
            description: "Ryan doesn't like it",
            rating: 2.5,
            userName: 'Kelly',
        },
        {
            title: '',
            description: 'Remind me not to buy this stuff again',
            rating: 2,
            userName: 'Creed',
        },
        {
            title: '',
            description: 'Way too flashy',
            rating: 1.5,
            userName: 'Angela',
        },
        {
            title: '',
            description: 'How could it be SO bad?!',
            rating: 1,
            userName: 'Michael',
        },
    ];

    private randomHTMLText = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat.</p><ul><li><i class="porto-icon-ok"></i>Any Product types that You want - Simple, Configurable</li><li><i class="porto-icon-ok"></i>Downloadable/Digital Products, Virtual Products</li><li><i class="porto-icon-ok"></i>Inventory Management with Backordered items</li></ul><p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, <br>quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>';

    public getRandomName = () => (nameGenerator().spaced).replace(/\b\w/g, l => l.toUpperCase());

    public async mockAll(): Promise<boolean> {
        await this.mockUsers();
        await this.mockPosts();
        await this.mockAttributes();
        await this.mockCategories();
        await this.mockProducts();
        await this.mockReviews();
        return true;
    }

    public async mockProducts(): Promise<boolean> {

        const images = [
            '/themes/@cromwell/theme-store/product.jpg',
            '/themes/@cromwell/theme-store/product_2.jpg',
            '/themes/@cromwell/theme-store/product_3.jpg'
        ];
        const imagesNum = 6;
        const getRandImg = () => images[Math.floor(Math.random() * (images.length))];

        const sizeVals = this.attributesMock[0].values;

        const description = this.randomHTMLText

        // Clear
        const prodsOld = await this.productRepo.find();
        const deletePromises: Promise<boolean>[] = []
        for (const oldProd of prodsOld) {
            deletePromises.push(this.productRepo.deleteProduct(oldProd.id));
        }
        await Promise.all([deletePromises]);

        const cats = await this.productCategoryRepo.find();

        const times = 250;
        const promises: Promise<TProduct>[] = [];

        for (let i = 0; i < times; i++) {
            const mainImage = getRandImg();
            const price = Math.round(Math.random() * 1000)
            const oldPrice = Math.random() > 0.5 ? Math.round(price / Math.random()) : undefined;

            let color = '';
            if (mainImage === images[0]) color = 'Blue';
            if (mainImage === images[1]) color = 'Orange';
            if (mainImage === images[2]) color = 'Purple';

            this.shuffleArray(cats);
            const catsNum = Math.floor(Math.random() * cats.length)
            const categoryIds: string[] = cats.slice(0, catsNum).map(c => c.id);

            const condition = Math.random() > 0.3 ? 'New' : 'Used';

            promises.push(this.productRepo.createProduct({
                name: this.getRandomName(),
                categoryIds,
                price: price,
                oldPrice: oldPrice,
                mainImage: mainImage,
                images: (() => {
                    const imgs: string[] = [mainImage];
                    for (let i = 0; i < imagesNum; i++) {
                        imgs.push(getRandImg())
                    };;
                    return imgs;
                })(),
                description: description,
                attributes: [
                    {
                        key: 'Color',
                        values: [
                            {
                                value: color,
                                productVariant: {
                                    images: [mainImage]
                                }
                            }
                        ]
                    },
                    {
                        key: 'Size',
                        values: this.shuffleArray(sizeVals).slice(0, Math.floor(Math.random() * 4) + 3).map(s => ({
                            value: s.value,
                            productVariant: {
                                price: price + Math.round(price * 0.2 * Math.random())
                            }
                        })).sort((a, b) => parseInt(a.value) - parseInt(b.value))
                    },
                    {
                        key: 'Condition',
                        values: [
                            {
                                value: condition,
                                productVariant: {
                                    price: condition === 'Used' ? Math.round(price * 0.4) : undefined
                                }
                            }
                        ]
                    }
                ],
                views: Math.floor(Math.random() * 1000)
            }));
        }
        await Promise.all([promises]);

        return true;
    }


    public async mockCategories(): Promise<boolean> {

        // Clear
        const categories = await this.productCategoryRepo.find();
        for (const cat of categories) {
            this.productCategoryRepo.delete(cat.id)
        }

        const categoriesMock: TProductCategoryInput[] = []
        for (let i = 0; i < 20; i++) {
            const name = this.getRandomName();
            categoriesMock.push({
                name,
                description: name + ' description goes here...'
            })
        }

        for (const cat of categoriesMock) {
            const catEntity = await this.productCategoryRepo.createProductCategory(cat);
            const subCatsNum = Math.floor(Math.random() * 5);
            const subCats: TProductCategoryInput[] = [];
            for (let j = 0; j < subCatsNum; j++) {
                const name = 'Subcategory ' + this.getRandomName();
                const subcat = {
                    name,
                    description: name + ' description',
                    parentId: catEntity.id
                } as TProductCategoryInput;
                await this.productCategoryRepo.createProductCategory(subcat);
            }

        }

        return true;
    }

    public async mockAttributes() {

        // Clear
        const attributsOld = await this.attributeRepo.find();
        for (const attr of attributsOld) {
            await this.attributeRepo.deleteAttribute(attr.id);
        }

        for (const attr of this.attributesMock) {
            await this.attributeRepo.createAttribute(attr);
        }

        return true;
    }


    public async mockReviews() {
        // Clear
        const reviewsOld = await this.productReviewRepo.find();
        for (const item of reviewsOld) {
            await this.productReviewRepo.deleteProductReview(item.id);
        }

        const products = await this.productRepo.find();
        const promises: Promise<TProductReview>[] = [];
        for (const prod of products) {
            this.shuffleArray(this.reviewsMock);
            const reviewsNum = Math.floor(Math.random() * this.reviewsMock.length)
            for (let i = 0; i < reviewsNum && i < this.reviewsMock.length; i++) {
                const review: TProductReviewInput = {
                    ...this.reviewsMock[i],
                    productId: prod.id
                }
                promises.push(this.productReviewRepo.createProductReview(review));
            }
        }
        await Promise.all([promises]);

        return true;
    }

    public async mockUsers() {
        // Clear
        const usersOld = await this.userRepo.find();
        for (const item of usersOld) {
            await this.userRepo.deleteUser(item.id);
        }

        const users: TUserInput[] = [
            {
                fullName: 'Creed',
                email: 'Creed@example.com',
                password: '12345',
                avatar: ''
            },
            {
                fullName: 'Pam',
                email: 'Pam@example.com',
                password: 'pampampam!',
                avatar: ''
            },
            {
                fullName: 'Michael',
                email: 'Michael@example.com',
                password: 'qwerty',
                avatar: ''
            }
        ]

        for (let user of users) {
            await this.userRepo.createUser(user);
        }

        return true;
    }

    public async mockPosts() {
        // Clear
        const postsOld = await this.postRepo.find();
        for (const item of postsOld) {
            await this.postRepo.deletePost(item.id);
        }

        const users = await this.userRepo.find();

        const images = [
            '/themes/@cromwell/theme-store/product.jpg',
            '/themes/@cromwell/theme-store/product_2.jpg',
            '/themes/@cromwell/theme-store/product_3.jpg'
        ];

        const getRandImg = () => images[Math.floor(Math.random() * (images.length))];

        const postQuillDelta = '{"ops":[{"insert":"Lorem ipsum dolor sit amet"},{"attributes":{"header":1},"insert":"\\n"},{"insert":"\\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus. Ac tortor dignissim convallis aenean et tortor. In iaculis nunc sed augue. Tristique senectus et netus et malesuada fames ac turpis. Fermentum leo vel orci porta non pulvinar neque. In fermentum posuere urna nec tincidunt praesent semper. Massa eget egestas purus viverra. \\nNunc eget lorem dolor sed viverra ipsum nunc aliquet. Praesent semper feugiat nibh sed pulvinar proin. Aliquet porttitor lacus luctus accumsan tortor posuere ac ut consequat. Tortor dignissim convallis aenean et tortor at risus. Sit amet tellus cras adipiscing enim eu turpis. Turpis tincidunt id aliquet risus feugiat. "},{"attributes":{"blockquote":true},"insert":"\\n"},{"insert":"\\nEt odio pellentesque diam volutpat. Imperdiet nulla malesuada pellentesque elit. Libero nunc consequat interdum varius sit amet mattis vulputate enim.\\n\\n"},{"attributes":{"bold":true},"insert":"Integer vitae justo eget magna fermentum iaculis eu. "},{"attributes":{"list":"bullet"},"insert":"\\n"},{"attributes":{"italic":true},"insert":"Fringilla urna porttitor rhoncus dolor. Sapien et ligula ullamcorper malesuada. "},{"attributes":{"list":"bullet"},"insert":"\\n"},{"attributes":{"underline":true},"insert":"Urna nec tincidunt praesent semper feugiat nibh. "},{"attributes":{"list":"bullet"},"insert":"\\n"},{"attributes":{"strike":true},"insert":"Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. "},{"attributes":{"list":"bullet"},"insert":"\\n"},{"insert":"\\n\\nUrna porttitor rhoncus dolor purus non enim. "},{"attributes":{"header":2},"insert":"\\n"},{"insert":"\\nArcu dui vivamus arcu felis bibendum ut tristique. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Mi proin sed libero enim. Elit pellentesque habitant morbi tristique senectus et netus. Tincidunt eget nullam non nisi est sit amet facilisis. Ipsum dolor sit amet consectetur adipiscing. Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. Turpis egestas integer eget aliquet nibh praesent tristique magna sit. Nibh praesent tristique magna sit amet purus. \\n\\n\\nPulvinar neque laoreet suspendisse interdum consectetur libero id. "},{"attributes":{"header":3},"insert":"\\n"},{"insert":"\\nElit eget gravida cum sociis natoque penatibus et. Nunc faucibus a pellentesque sit amet porttitor eget dolor morbi. Varius quam quisque id diam vel quam elementum pulvinar etiam. Lorem ipsum dolor sit amet consectetur adipiscing elit. Potenti nullam ac tortor vitae purus faucibus. Mattis nunc sed blandit libero volutpat. Facilisi nullam vehicula ipsum a. "},{"attributes":{"align":"center"},"insert":"\\n"}]}';
        const postContent = '<div class="editor_jY3Vp ql-container ql-snow ql-disabled" id="editor"><div class="ql-editor" data-gramm="false" contenteditable="false" data-placeholder="Let`s write an awesome story!"><h1>Lorem ipsum dolor sit amet</h1><p><br></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus. Ac tortor dignissim convallis aenean et tortor. In iaculis nunc sed augue. Tristique senectus et netus et malesuada fames ac turpis. Fermentum leo vel orci porta non pulvinar neque. In fermentum posuere urna nec tincidunt praesent semper. Massa eget egestas purus viverra. </p><blockquote>Nunc eget lorem dolor sed viverra ipsum nunc aliquet. Praesent semper feugiat nibh sed pulvinar proin. Aliquet porttitor lacus luctus accumsan tortor posuere ac ut consequat. Tortor dignissim convallis aenean et tortor at risus. Sit amet tellus cras adipiscing enim eu turpis. Turpis tincidunt id aliquet risus feugiat. </blockquote><p><br></p><p>Et odio pellentesque diam volutpat. Imperdiet nulla malesuada pellentesque elit. Libero nunc consequat interdum varius sit amet mattis vulputate enim.</p><p><br></p><ul><li><strong>Integer vitae justo eget magna fermentum iaculis eu. </strong></li><li><em>Fringilla urna porttitor rhoncus dolor. Sapien et ligula ullamcorper malesuada. </em></li><li><u>Urna nec tincidunt praesent semper feugiat nibh. </u></li><li><s>Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. </s></li></ul><p><br></p><p><br></p><h2>Urna porttitor rhoncus dolor purus non enim. </h2><p><br></p><p>Arcu dui vivamus arcu felis bibendum ut tristique. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Mi proin sed libero enim. Elit pellentesque habitant morbi tristique senectus et netus. Tincidunt eget nullam non nisi est sit amet facilisis. Ipsum dolor sit amet consectetur adipiscing. Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. Turpis egestas integer eget aliquet nibh praesent tristique magna sit. Nibh praesent tristique magna sit amet purus. </p><p><br></p><p><br></p><h3>Pulvinar neque laoreet suspendisse interdum consectetur libero id. </h3><p><br></p><p class="ql-align-center">Elit eget gravida cum sociis natoque penatibus et. Nunc faucibus a pellentesque sit amet porttitor eget dolor morbi. Varius quam quisque id diam vel quam elementum pulvinar etiam. Lorem ipsum dolor sit amet consectetur adipiscing elit. Potenti nullam ac tortor vitae purus faucibus. Mattis nunc sed blandit libero volutpat. Facilisi nullam vehicula ipsum a. </p></div><div class="ql-clipboard" contenteditable="true" tabindex="-1"></div><div class="ql-tooltip ql-hidden"><a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a><input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL"><a class="ql-action"></a><a class="ql-remove"></a></div></div>';

        const promises: Promise<TPost>[] = [];

        for (let i = 0; i < 20; i++) {

            promises.push(this.postRepo.createPost({
                content: postContent,
                delta: postQuillDelta,
                authorId: users[Math.floor(Math.random() * (users.length))].id,
                title: this.getRandomName(),
                mainImage: getRandImg(),
                isPublished: true,
                isEnabled: true
            }));
        }
        await Promise.all([promises]);

        return true;
    }
}



