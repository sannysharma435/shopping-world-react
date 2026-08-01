import "./Products.css";

function Products() {

    const products = [

        {
            id:1,
            name:"iPhone 16 Pro",
            price:"₹1,19,999",
            image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN34uzeitxVtkIhWxZZ5Gb5hiiCKFJ-khUx0AtK9FHqA&s=10"
        },

        {
            id:2,
            name:"Gaming Laptop",
            price:"₹79,999",
            image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"
        },

        {
            id:3,
            name:"Smart Watch",
            price:"₹9,999",
            image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
        },

        {
            id:4,
            name:"Running Shoes",
            price:"₹4,999",
            image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
        }

    ];

    return(

        <section className="products">

            <h2>Featured Products</h2>

            <div className="product-grid">

                {products.map((item)=>(
                    <div className="card" key={item.id}>

                        <img src={item.image} alt={item.name}/>

                        <h3>{item.name}</h3>

                        <p>{item.price}</p>

                        <button>Add to Cart</button>

                    </div>
                ))}

            </div>

        </section>

    )

}

export default Products;