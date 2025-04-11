import invoiceHelper from '../../helpers/invoice.helper';
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

export async function addNewInvoiceHandler(input) {
    return await invoiceHelper.addObject(input);
}

export async function getInvoiceDetailsHandler(input) {
    return await invoiceHelper.getObjectById(input);
}

export async function updateInvoiceDetailsHandler(input) {
    return await invoiceHelper.directUpdateObject(input.objectId, input.updateObject);
}

export async function getInvoiceListHandler(input) {
    const list = await invoiceHelper.getAllObjects(input);
    const count = await invoiceHelper.getAllObjectCount(input);
    return { list, count };
}

export async function deleteInvoiceHandler(input) {
    return await invoiceHelper.deleteObjectById(input);
}

export async function getInvoiceByQueryHandler(input) {
    return await invoiceHelper.getObjectByQuery(input);
}


export async function downloadInvoiceHanlder(input, res) {
    try {
        const id = input.objectId;
        const populatedQuery = {
            id: id,
            populatedQuery: {
                path: "items.product user_Id order_Id",
            },
        };

        const invoice = await invoiceHelper.getObjectById(populatedQuery);
        if (!invoice) {
            throw "Invoice not found"
        }

        const pdfPath = path.join("/tmp", `invoice_${invoice.invoiceNumber}.pdf`);
        const doc = new PDFDocument({ margin: 50 });
        const writeStream = fs.createWriteStream(pdfPath);
        doc.pipe(writeStream);

        // Header
        doc.fontSize(25).text("SkyWall", { align: "center" }).moveDown(0.5);
        doc.fontSize(12).text("Address: 49/26 Site: 4, Sahibabad Industrial Area Ghaziabad, Uttar Pradesh, India 201010.", { align: "center" });
        doc.text("Phone: +91 7079797902", { align: "center" });
        doc.text("Email: customer.care@foxskyindia.com", { align: "center" });
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown().fontSize(20).text(`Invoice`, { align: "center" });
        doc.moveDown(0.5).fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
        doc.text(`Invoice Date: ${new Date(invoice.created_at).toLocaleDateString()}`);
        doc.moveDown();

        // Customer Details
        doc.fontSize(14).text("Billed To:", { underline: true });
        doc.fontSize(12).text(`Customer ID: ${invoice.user_Id._id}`);
        doc.moveDown();

        // Table Headers
        const columns = [
            { title: "Item", x: 50, width: 150 },
            { title: "Quantity", x: 200, width: 50 },
            { title: "Warranty Expiry", x: 250, width: 100 },
            { title: "Extended (Months)", x: 350, width: 100 },
            { title: "Total Warranty (Months)", x: 450, width: 100 },
            { title: "Total", x: 500, width: 80, align: "right" }
        ];
        
        doc.fontSize(14).text("Items:", { underline: true });
        doc.moveDown(0.5).fontSize(12);
        
        const headerY = doc.y;
        columns.forEach(col => {
            doc.text(col.title, col.x, headerY, { width: col.width, align: col.align || "left" });
        });
        doc.moveDown();

        // Item Rows
        let totalAmount = invoice.amount || 0;
        for (const item of invoice.items || []) {
            if (!item.product) continue;
            const startY = doc.y;
            const itemData = {
                name: item.product.name || "Unknown Item",
                quantity: item.quantity ?? 1,
                warrantyExpiry: new Date(item.warranty_expiry_date).toLocaleDateString() || "N/A",
                extended: item.extendedWarrantyDuration || "N/A",
                totalWarranty: item.totalWarranty || "N/A",
                total: totalAmount.toFixed(2)
            };

            doc.text(itemData.name, columns[0].x, startY, { width: columns[0].width });
            doc.text(itemData.quantity.toString(), columns[1].x, startY, { width: columns[1].width });
            doc.text(itemData.warrantyExpiry, columns[2].x, startY, { width: columns[2].width });
            doc.text(itemData.extended.toString(), columns[3].x, startY, { width: columns[3].width });
            doc.text(itemData.totalWarranty.toString(), columns[4].x, startY, { width: columns[4].width });
            doc.text(itemData.total, columns[5].x, startY, { width: columns[5].width, align: "right" });
            
            doc.moveDown();
        }

        // Summary
        doc.moveDown(4);
        doc.fontSize(14).text("Summary:", 50, doc.y, { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Total: ${invoice.currency} ${totalAmount.toFixed(2)}`, 50);
        doc.moveDown(2);

        // Footer
        doc.fontSize(10).text("Thank you for your business!", { align: "center" });
        doc.moveTo(50, doc.y + 10).lineTo(550, doc.y + 10).stroke();
        doc.fontSize(10).text("Skywall © 2025", { align: "center" });
        
        doc.end();

        // Wait for PDF file creation
        writeStream.on("finish", () => {
            res.download(pdfPath, `invoice_${invoice.invoiceNumber}.pdf`, (err) => {
                if (err) {
                    console.error("Error sending file:", err);
                    res.status(500).send({ status: "Error", message: "Failed to download invoice" });
                }

                // Delete the PDF after sending
                fs.unlink(pdfPath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error("Failed to delete invoice:", unlinkErr);
                    }
                });
            });
        });
    } catch (error) {
        console.error("Error generating invoice PDF:", error);
        res.status(500).send({ status: "Error", message: "Failed to generate invoice" });
    }
}