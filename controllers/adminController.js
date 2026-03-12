const db = require("../config/db");

// GET ALL NOMINATIONS
exports.getAllNominations = async (req, res) => {
    try {

        const [rows] = await db.query(`
            SELECT 
                nomination_id,
                full_name,
                email,
                mobile,
                gender,
                college,
                designation,
                experience_years,
                category,
                achievements,
                address,
                status,
                created_at
            FROM nominations
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error("Fetch nominations error:", error);

        res.status(500).json({
            message: "Failed to fetch nominations"
        });

    }
};const ExcelJS = require("exceljs");

// EXPORT NOMINATIONS TO EXCEL
exports.downloadNominationsExcel = async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT 
                nomination_id,
                full_name,
                email,
                mobile,
                gender,
                college,
                designation,
                experience_years,
                category,
                status,
                created_at
            FROM nominations
        `);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Nominees");

        worksheet.columns = [
            { header: "Nomination ID", key: "nomination_id", width: 20 },
            { header: "Full Name", key: "full_name", width: 25 },
            { header: "Email", key: "email", width: 30 },
            { header: "Mobile", key: "mobile", width: 15 },
            { header: "Gender", key: "gender", width: 10 },
            { header: "College", key: "college", width: 30 },
            { header: "Designation", key: "designation", width: 20 },
            { header: "Experience", key: "experience_years", width: 10 },
            { header: "Category", key: "category", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Submitted At", key: "created_at", width: 20 }
        ];

        rows.forEach(row => {
            worksheet.addRow(row);
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=bee_awards_nominations.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {

        console.error("Excel export error:", error);

        res.status(500).json({
            message: "Failed to export Excel"
        });

    }

};