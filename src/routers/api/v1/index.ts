import { NextFunction, Request, Response } from "express";
import { MappableRouter, Middleware } from "../../../types/utils/mappable-router.js";
import authenticateWithApiKey from "../../../middlewares/authenticate-with-api-key.js";
import getCsrfToken from "../../../utils/auth/get-csrf-token.js";
import prisma from "../../../db/prisma.js";

export const router: MappableRouter = {
    method: "post",
    endpoint: "/api/v1/donations/dev-products",
    middlewares: new Set<Middleware>().add(authenticateWithApiKey),
    controller: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate request data

            const { data } = req.body;

            if (typeof data !== "object") {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid data"
                })
            }

            let { price, coverTax }: { price: number, coverTax: boolean } = data;

            if (!Number.isSafeInteger(price)) {
                return res.status(400).json({
                    status: 400,
                    message: "\"price\" must be an integer"
                })
            }

            if (price <= 0) {
                return res.status(400).json({
                    status: 400,
                    message: "Price cannot be less than or equal to 0 robux"
                })
            }

            if (price > 1000000000) {
                return res.status(400).json({
                    status: 400,
                    message: "Price cannot exceed Roblox's limit of 1000000000 robux"
                })
            }

            if (typeof coverTax !== "boolean") {
                return res.status(400).json({
                    status: 400,
                    message: "\"coverTax\" must be a boolean"
                })
            }

            if (coverTax) {
                price += parseInt((price * 30 / 100).toFixed(0));
            }

            // Get Universe ID

            const placeId = req.headers["roblox-id"];

            if (typeof placeId !== "string") {
                return res.status(400).json({
                    status: 400,
                    message: "\"roblox-id\" header is required"
                })
            }

            if (!Number.isInteger(Number(placeId))) {
                return res.status(400).json({
                    status: 400,
                    message: "\"roblox-id\" header value must be an integer"
                })
            }

            const { universeId } = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`)
                .then(async res => await res.json());

            if (typeof universeId !== "number") {
                throw new Error("Roblox API did not return a valid universe ID");
            }

            // Return saved dev product Id if a dev product with the same price was already created

            const existingDevProduct = await prisma.devproducts.findFirst({
                where: {
                    Price: price,
                    UniverseId: universeId
                }
            });

            if (existingDevProduct) {
                return res.status(200).json({
                    status: 200,
                    message: "Success",
                    data: {
                        devProductId: existingDevProduct.Id
                    }
                })
            }

            // Create dev product

            const csrfToken = await getCsrfToken() || "";
            const devProductName = `${price} Robux Donation`;

            const { id: devProductId } = await fetch(`https://apis.roblox.com/developer-products/v1/universes/${universeId}/developerproducts?name=${devProductName}&priceInRobux=${price}`, {
                method: "POST",
                headers: {
                    Cookie: `.ROBLOSECURITY=${process.env.ROBLOSECURITY}`,
                    "x-csrf-token": csrfToken
                }
            })
            .then(async res => {
                const data = await res.json();

                console.log(data);

                return data;
            });

            if (typeof devProductId !== "number") {
                throw new Error("Roblox API did not return a valid dev product ID");
            }

            // Get ID for MarketplaceService

            const { id: devProductMarketplaceId } = await fetch(`https://apis.roblox.com/developer-products/v1/developer-products/${devProductId}`, {
                headers: {
                    Cookie: `.ROBLOSECURITY=${process.env.ROBLOSECURITY}`,
                }
            })
            .then(async res => await res.json());

            if (typeof devProductMarketplaceId !== "number") {
                throw new Error("Roblox API did not return a valid marketplace ID");
            }

            // Save the the dev product into the database

            await prisma.devproducts.create({
                data: {
                    Id: devProductMarketplaceId,
                    Price: price,
                    UniverseId: universeId
                }
            })

            res.status(201).json({
                status: 201,
                message: "Created",
                data: {
                    devProductId: devProductMarketplaceId
                }
            })
        } catch (error) {
            next(error);
        }
    }
}