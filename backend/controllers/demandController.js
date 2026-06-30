import Demand from '../models/Demand.js';

// Helper to convert MongoDB _id to id in demand documents
const normalizeDemand = (demand) => {
  if (!demand) return demand;
  const obj = demand.toObject ? demand.toObject() : demand;
  return { ...obj, id: obj._id.toString() };
};

const normalizeDemands = (demands) => {
  return demands.map(normalizeDemand);
};

export const getDemands = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) query.status = status;

    const demands = await Demand.find(query).sort({ createdAt: -1 });
    res.json({ demands: normalizeDemands(demands) });
  } catch (error) {
    console.error('Get demands error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getDemand = async (req, res) => {
  try {
    const demand = await Demand.findById(req.params.id);
    if (!demand) {
      return res.status(404).json({ error: 'Demand not found' });
    }
    res.json({ demand: normalizeDemand(demand) });
  } catch (error) {
    console.error('Get demand error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createDemand = async (req, res) => {
  try {
    // Extract user from JWT if authenticated
    const user = req.user;
    const { cropId, targetQuantity, pricePerQuintal, bonusPerQuintal, deadline, buyerId: bodyBuyerId } = req.body;

    // Use JWT user info if authenticated, otherwise fall back to body data
    const buyerId = user?.uid || bodyBuyerId;

    if (!buyerId) {
      return res.status(400).json({ error: 'Authentication required. Please login to create a demand.' });
    }

    const now = new Date().toISOString();

    const demand = new Demand({
      cropId,
      targetQuantity,
      filledQuantity: 0,
      pricePerQuintal,
      bonusPerQuintal: bonusPerQuintal || 0,
      deadline,
      status: 'open',
      buyerId,
      members: [],
      contributors: 0,
      createdAt: now,
    });

    await demand.save();
    res.status(201).json({ demand: normalizeDemand(demand) });
  } catch (error) {
    console.error('Create demand error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const joinDemand = async (req, res) => {
  try {
    const { demandId } = req.params;
    const { farmerId, quantity } = req.body;

    const demand = await Demand.findById(demandId);
    if (!demand) {
      return res.status(404).json({ error: 'Demand not found' });
    }

    if (demand.status !== 'open') {
      return res.status(400).json({ error: 'Demand is not open for joining' });
    }

    const newMember = {
      farmerId,
      quantity: Number(quantity),
      joinedAt: new Date().toISOString(),
    };

    demand.members.push(newMember);
    demand.filledQuantity = (demand.filledQuantity || 0) + Number(quantity);
    demand.contributors = (demand.contributors || 0) + 1;

    // Check if demand is now filled
    if (demand.filledQuantity >= demand.targetQuantity) {
      demand.status = 'filled';
    }

    await demand.save();
    res.json({ demand: normalizeDemand(demand) });
  } catch (error) {
    console.error('Join demand error:', error);
    res.status(500).json({ error: error.message });
  }
};