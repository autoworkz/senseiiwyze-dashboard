import {
	feature,
	product,
	featureItem,
	pricedFeatureItem,
	priceItem,
} from "atmn";

// Features
export const organizationSeats = feature({
	id: "organization_seats",
	name: "Organization seats",
	type: "continuous_use",
});

// Products
export const starterProduct = product({
	id: "starter_product",
	name: "Starter Product",
	items: [
		priceItem({
			price: 29,
			interval: "month",
		}),

		featureItem({
			feature_id: organizationSeats.id,
			included_usage: 5,
		}),
	],
});

export const professionalProduct = product({
	id: "professional_product",
	name: "Professional Product",
	items: [
		priceItem({
			price: 59,
			interval: "month",
		}),
	],
});

export const enterpriseProduct = product({
	id: "enterprise_product",
	name: "Enterprise Product",
	items: [
		priceItem({
			price: 100,
			interval: "month",
		}),
	],
});
