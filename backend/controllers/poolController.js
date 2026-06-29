import Pool from '../models/Pool.js';

export const getPools = async (req, res) => {
  try {
    const { status, commodity, creatorRole } = req.query;
    let query = {};

    if (status) query.status = status;
    if (commodity) query.commodity = commodity;
    if (creatorRole) query.creatorRole = creatorRole;

    const pools = await Pool.find(query).sort({ createdAt: -1 });
    res.json({ pools });
  } catch (error) {
    console.error('Get pools error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getPool = async (req, res) => {
  try {
    const pool = await Pool.findById(req.params.id);
    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }
    res.json({ pool });
  } catch (error) {
    console.error('Get pool error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createPool = async (req, res) => {
  try {
    const {
      creatorId,
      creatorRole,
      creatorName,
      commodity,
      pricePerUnit,
      unit,
      targetQuantity,
      requestedQuantity,
      deadline,
      location,
      description,
      lat,
      lng,
    } = req.body;

    const now = new Date().toISOString();

    const pool = new Pool({
      creatorId,
      creatorRole,
      creatorName: creatorName || 'Unknown',
      commodity,
      pricePerUnit: Number(pricePerUnit) || 0,
      unit: unit || 'quintal',
      targetQuantity: Number(targetQuantity) || Number(requestedQuantity) || 0,
      requestedQuantity: Number(requestedQuantity) || Number(targetQuantity) || 0,
      filledQuantity: 0,
      members: [],
      status: 'open',
      deadline: deadline || null,
      location: location || null,
      description: description || null,
      createdAt: now,
      updatedAt: now,
      lat: lat || null,
      lng: lng || null,
    });

    await pool.save();
    res.status(201).json({ id: pool._id.toString(), ...pool.toObject() });
  } catch (error) {
    console.error('Create pool error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updatePool = async (req, res) => {
  try {
    const pool = await Pool.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    res.json({ pool });
  } catch (error) {
    console.error('Update pool error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const joinPool = async (req, res) => {
  try {
    const { poolId } = req.params;
    const { farmerId, farmerName, quantity } = req.body;

    const pool = await Pool.findById(poolId);
    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    if (pool.status !== 'open') {
      return res.status(400).json({ error: 'Pool is not open for joining' });
    }

    const newMember = {
      farmerId,
      farmerName: farmerName || 'Unknown',
      quantity: Number(quantity),
      joinedAt: new Date().toISOString(),
    };

    pool.members.push(newMember);
    pool.filledQuantity = (pool.filledQuantity || 0) + Number(quantity);
    pool.updatedAt = new Date();

    // Check if pool is now filled
    if (pool.filledQuantity >= pool.targetQuantity) {
      pool.status = 'filled';
    }

    await pool.save();
    res.json({ pool });
  } catch (error) {
    console.error('Join pool error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const closePool = async (req, res) => {
  try {
    const pool = await Pool.findByIdAndUpdate(
      req.params.id,
      { status: 'closed', updatedAt: new Date() },
      { new: true }
    );

    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    res.json({ pool });
  } catch (error) {
    console.error('Close pool error:', error);
    res.status(500).json({ error: error.message });
  }
};