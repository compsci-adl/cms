# CS Club CMS
The Computer Science Club's CMS.
## Getting Started
To get started, please follow these steps:
1. Install the dependencies.
```bash
pnpm install
```
2. Copy `.env.example` to a new file `.env` and set the required environment variables. 
3. If MongoDB is not already installed and you’re not using a Docker container, follow the [MongoDB Community Edition Installation Guide](https://www.mongodb.com/docs/manual/administration/install-community/) and start the service.
4. Run the development server.
```
pnpm dev
```
5. Open [http://localhost:4000/admin](http://localhost:4000/admin) with your browser to go to the Payload admin page.
## User
The root user is seeded into database upon first load the credentials can be changed in the `.env` file:
```bash
ROOT_EMAIL=
ROOT_PASS=
```
This user has admin permissions to create more users and give further permissions.
## Compressing Gallery Images
1. Create a new folder named `images` in your project directory.
2. Inside the `images` folder, create a subfolder for each gallery. Use descriptive names such as `meet-and-greet-S1-2025` or `industry-night-2025`.
3. Place the photos you want to compress inside the appropriate gallery subfolder.
4. Install the Python requirements:

    ```bash
    pip install -r requirements.txt
    ```
5. Run the following command to compress all images:
    ```bash
    python compress-images.py
    ```
This will process and compress the images in each gallery folder. You can now upload these photos to the CMS.
## Contributing
We welcome contributions to enhance the CS Club CMS! If you find any issues, have suggestions, or want to request a feature, please follow our [Contributing Guidelines](https://github.com/compsci-adl/.github/blob/main/CONTRIBUTING.md).
## License
This project is licensed under the MIT License.
See [LICENSE](LICENSE) for details.