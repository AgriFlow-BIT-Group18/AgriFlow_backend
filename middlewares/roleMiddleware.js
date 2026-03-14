const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

const distributor = (req, res, next) => {
    if (req.user && req.user.role === 'distributor') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a distributor' });
    }
};

const staff = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'distributor')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as staff' });
    }
};

module.exports = { admin, distributor, staff };