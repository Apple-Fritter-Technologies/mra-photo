const packageInformation = {
    package1: {
        title: "Lifestyle",
        cost: 450,
        duration: 60,
        durationType: "min",
        images: 40,
        outfits: 1,
        explanation: "Maternity, Family, Couples, Milestone",
    },
    package2: {
        title: "Senior",
        cost: 500,
        duration: 60,
        durationType: "min",
        images: 55,
        outfits: 2,
        explanation: "Graduation Photo",
    },
    package3: {
        title: "Newborn/Fresh 48",
        cost: 600,
        duration: 2,
        durationType: "hour",
        images: 70,
        outfits: 2,
        explanation: "2 Outfits",
    },
}

function findPackageWithName(name) {
    for (const package in packageInformation) {
        if (packageInformation[package].title == name) {
            return packageInformation[package];
        }
    }
}