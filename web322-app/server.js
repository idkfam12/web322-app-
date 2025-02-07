const express = require("express");
const path = require("path");
const storeService = require("./store-service");
const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.static(path.join(__dirname, "public")));


storeService.initialize()
    .then(() => {
        console.log("Store data initialized successfully.");

        
        app.get("/", (req, res) => {
            res.redirect("/about");
        });

        app.get("/about", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "about.html"));
        });

        app.get("/shop", (req, res) => {
            storeService.getPublishedItems()
                .then(data => res.json(data))
                .catch(err => res.status(500).json({ message: err }));
        });

        app.get("/items", (req, res) => {
            storeService.getAllItems()
                .then(data => res.json(data))
                .catch(err => res.status(500).json({ message: err }));
        });

        app.get("/categories", (req, res) => {
            storeService.getCategories()
                .then(data => res.json(data))
                .catch(err => res.status(500).json({ message: err }));
        });

        // 404 Error Handling
        app.use((req, res) => {
            res.status(404).send("Page Not Found");
        });

        app.listen(PORT, () => {
            console.log(`Express HTTP server listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log("Failed to initialize data:", err);
    });
