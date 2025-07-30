const csv = require("csv-parser");
const XLSX = require("xlsx");
const { Readable } = require("stream");
const DistributedList = require("../models/DistributedList");
const Agent = require("../models/Agent");

const handleUpload = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const ext = file.originalname.split(".").pop().toLowerCase();
    let data = [];

    if (ext === "csv") {
      const stream = Readable.from(file.buffer);
      await new Promise((resolve, reject) => {
        stream
          .pipe(csv())
          .on("data", (row) => {
            if (row.FirstName && row.Phone && row.Notes) {
              data.push({
                FirstName: row.FirstName.trim(),
                Phone: row.Phone.trim(),
                Notes: row.Notes.trim(),
              });
            }
          })
          .on("end", resolve)
          .on("error", reject);
      });
    } else if (["xlsx", "xls"].includes(ext)) {
      const workbook = XLSX.read(file.buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(sheet);

      data = rawData.filter(row =>
        row.FirstName && row.Phone && row.Notes
      ).map(row => ({
        FirstName: String(row.FirstName).trim(),
        Phone: String(row.Phone).trim(),
        Notes: String(row.Notes).trim(),
      }));
    } else {
      return res.status(400).json({ error: "Invalid file format. Only csv, xlsx, xls allowed." });
    }

    if (!data.length) {
      return res.status(400).json({ error: "File is empty or contains no valid rows." });
    }

    // Check for duplicates in DistributedList
    const phones = data.map(item => item.Phone);
    const existingDistributions = await DistributedList.find({ 
      "data.Phone": { $in: phones } 
    });
    
    // Extract all existing phone numbers
    const existingPhones = existingDistributions.flatMap(
      dist => dist.data.map(item => item.Phone)
    );

    const duplicates = data.filter(item => existingPhones.includes(item.Phone));
    const uniqueData = data.filter(item => !existingPhones.includes(item.Phone));

    if (!uniqueData.length) {
      return res.status(400).json({ 
        error: "All leads in the file already exist in distributed lists.",
        duplicates: duplicates.length
      });
    }

    const agents = await Agent.find();
    if (agents.length < 1) {
      return res.status(400).json({ error: "No agents found to distribute." });
    }

    // Distribute only unique data
    const distributed = agents.map(() => []);
    uniqueData.forEach((item, index) => {
      const agentIndex = index % agents.length;
      distributed[agentIndex].push(item);
    });

    // Update existing distributions with new data
    const bulkOps = agents.map((agent, index) => ({
      updateOne: {
        filter: { agentId: agent._id },
        update: { 
          $push: { data: { $each: distributed[index] } },
          $setOnInsert: { createdAt: new Date() }
        },
        upsert: true
      }
    }));

    await DistributedList.bulkWrite(bulkOps);

    return res.status(200).json({ 
      message: "File processed successfully!",
      stats: {
        total: data.length,
        duplicates: duplicates.length,
        newLeads: uniqueData.length,
        distributed: uniqueData.length
      }
    });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Server error while processing file." });
  }
};

const checkDuplicates = async (req, res) => {
  try {
    const { phones } = req.body;
    
    if (!phones || !Array.isArray(phones)) {
      return res.status(400).json({ error: "Phone numbers array required" });
    }

    const existingDistributions = await DistributedList.find({ 
      "data.Phone": { $in: phones } 
    });
    
    const existingPhones = existingDistributions.flatMap(
      dist => dist.data.map(item => item.Phone)
    );

    return res.status(200).json({ 
      duplicates: existingPhones,
      count: existingPhones.length
    });

  } catch (error) {
    console.error("Duplicate check error:", error);
    return res.status(500).json({ error: "Server error during duplicate check" });
  }
};

module.exports = { handleUpload, checkDuplicates };