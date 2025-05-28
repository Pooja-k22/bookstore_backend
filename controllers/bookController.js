const books = require("../model/bookModel");
const stripe = require("stripe")(
  "sk_test_51RSxz4PGssiMfHarsg09a8lb7xbV4SKjvSqybr7oeRYzYlCNmtNh1F16Q5G8vVvbckV2cwasLGT6BPXYqgKqpXmG00gxil9jwu"
);

// to add books
exports.addBookController = async (req, res) => {
  console.log("inside book controller");
  const {
    title,
    author,
    noofpages,
    imageurl,
    price,
    dprice,
    abstract,
    publisher,
    language,
    isbn,
    category,
  } = req.body;

  console.log(
    title,
    author,
    noofpages,
    imageurl,
    price,
    dprice,
    abstract,
    publisher,
    language,
    isbn,
    category
  );

  uploadedImages = [];
  req.files.map((item) => uploadedImages.push(item.filename));
  console.log(uploadedImages);

  const email = req.payload;
  console.log(email);

  try {
    const existingBook = await books.findOne({ title, userMail: email });

    if (existingBook) {
      res.status(401).json("you have already added the book");
    } else {
      const newBook = new books({
        title,
        author,
        noofpages,
        imageurl,
        price,
        dprice,
        abstract,
        publisher,
        language,
        isbn,
        category,
        uploadedImages,
        userMail: email,
      });

      await newBook.save();
      res.status(200).json(newBook);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// to get home books
exports.getHomeBookController = async (req, res) => {
  try {
    const allBooks = await books.find().sort({ _id: -1 }).limit(4);
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get all books
exports.getAllBookController = async (req, res) => {
  console.log(req.query);
  const searchkey = req.query.search;
  const email = req.payload;

  try {
    const query = {
      title: {
        $regex: searchkey,
        $options: "i",
      },
      userMail: { $ne: email },
    };
    const allBooks = await books.find(query);
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(500).json(error);
  }
};

// to get a particular book
exports.getABookController = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const aBook = await books.findOne({ _id: id });
    res.status(200).json(aBook);
  } catch (error) {
    res.status(500).json(error);
  }
};

//
exports.getAllBookAdminController = async (req, res) => {
  try {
    const allExistingBooks = await books.find();
    res.status(200).json(allExistingBooks);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.approveBookController = async (req, res) => {
  const {
    _id,
    title,
    author,
    noofpages,
    imageurl,
    price,
    dprice,
    abstract,
    publisher,
    language,
    isbn,
    category,
    uploadedImages,
    status,
    userMail,
    brought,
  } = req.body;

  console.log(
    _id,
    title,
    author,
    noofpages,
    imageurl,
    price,
    dprice,
    abstract,
    publisher,
    language,
    isbn,
    category,
    uploadedImages,
    status,
    userMail,
    brought
  );

  try {
    const existingBook = await books.findByIdAndUpdate(
      { _id },
      {
        _id,
        title,
        author,
        noofpages,
        imageurl,
        price,
        dprice,
        abstract,
        publisher,
        language,
        isbn,
        category,
        uploadedImages,
        status: "approved",
        userMail,
        brought,
      },
      { new: true }
    );

    //await existingBook.save()
    res.status(200).json(existingBook);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get all book add by user
exports.getAllUserBookController = async (req, res) => {
  const email = req.payload;
  console.log(email);

  try {
    const allUserBook = await books.find({ userMail: email });
    res.status(200).json(allUserBook);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get all book brought by user
exports.getAllUserBroughtBookController = async (req, res) => {
  const email = req.payload;
  console.log(email);

  try {
    const allUserBroughtBook = await books.find({ brought: email });
    res.status(200).json(allUserBroughtBook);
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete
exports.deleteAUserBookController = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    await books.findByIdAndDelete({ _id: id });
    res.status(200).json("delete successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};

// payment controller
exports.makePaymentController = async (req, res) => {
  const { booksDetails } = req.body;
  const email = req.payload;
  try {
    const existingBook = await books.findByIdAndUpdate(
      { _id: booksDetails._id },
      {
        title: booksDetails.title,
        author: booksDetails.author,
        noofpages: booksDetails.noofpages,
        imageurl: booksDetails.imageurl,
        price: booksDetails.price,
        dprice: booksDetails.dprice,
        abstract: booksDetails.abstract,
        publisher: booksDetails.publisher,
        language: booksDetails.language,
        isbn: booksDetails.isbn,
        category: booksDetails.category,
        uploadedImages: booksDetails.uploadedImages,
        status: "sold",
        userMail: booksDetails.userMail,
        brought: email
      },
      { new: true }
    );

    const line_item = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: booksDetails.title,
            description: `${booksDetails.author} | ${booksDetails.publisher}`,
            images: [booksDetails.imageurl],
            metadata: {
              title: booksDetails.title,
              author: booksDetails.author,
              noofpages: booksDetails.noofpages,
              imageurl: booksDetails.imageurl,
              price: `${booksDetails.price}`,
              dprice: `${booksDetails.dprice}`,
              abstract: booksDetails.abstract.slice(0,20),
              publisher: booksDetails.publisher,
              language: booksDetails.language,
              isbn: booksDetails.isbn,
              category: booksDetails.category,
            //   uploadedImages: booksDetails.uploadedImages,
              status: "sold",
              userMail: booksDetails.userMail,
              brought: email
            }
          },
          unit_amount:Math.round(booksDetails.dprice*100) // amount unit always in cent and for making round math.round
        },
        quantity:1
      }
    ];
    // create stripe checkout section
    const session = await stripe.checkout.sessions.create({
      // purchase using card
      payment_method_types: ["card"],
      // details of product that is purchasing
      line_items: line_item,
      // make payment
      mode: "payment",
      // if payment is successful - the url to be shown
      success_url: "http://localhost:5173/payment-success",
      // if payment is failed - the url to be shown
      cancel_url: "http://localhost:5173/payment-error",
    });
    console.log(session);

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json(error);
  }
};
