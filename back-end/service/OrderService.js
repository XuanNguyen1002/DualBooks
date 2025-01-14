const OrderModel = require('../models/OrderModel');
const Customer = require('../models/CustomerModel');
const OrderItem = require('../models/OrderItemModel');

// Tạo một đơn hàng mới
exports.createOrder = async (orderData) => {
    try {
        // Khởi tạo đơn hàng mới với các trường đã cung cấp
        const newOrder = new OrderModel({
            customer_id: orderData.order_type === 'online' ? orderData.customer_id : undefined, // ID khách hàng cho đơn hàng online
            staff_id: orderData.order_type === 'offline' ? orderData.staff_id : undefined, // ID nhân viên cho đơn hàng offline
            order_date: orderData.order_date || Date.now(), // Ngày đặt hàng, mặc định là ngày hiện tại nếu không có
            order_status: orderData.order_type === 'offline' ? 'Hoàn thành' : (orderData.order_status || 'Chờ xác nhận'), // Trạng thái mặc định cho đơn hàng offline là 'Hoàn thành'
            payment_status: orderData.order_type === 'offline' ? 'Đã thanh toán' : (orderData.payment_status || 'Chưa thanh toán'), // Trạng thái thanh toán mặc định cho đơn hàng offline là 'Đã thanh toán'
            total_amount: orderData.total_amount, // Tổng số tiền
            total_quantity: orderData.total_quantity, // Tổng số lượng
            shipping_address: orderData.shipping_address || "Đường số 3. CVPM Quang Trung, Quận 12", // Địa chỉ giao hàng, mặc định nếu không có
            order_type: orderData.order_type, // Loại đơn hàng: online hoặc offline
            customer_feedback: orderData.customer_feedback, // Đánh giá của khách hàng
            payment_method: orderData.payment_method // Phương thức thanh toán
        });

        // Lưu đơn hàng vào cơ sở dữ liệu
        await newOrder.save(); 
        return newOrder;
    } catch (error) {
        throw new Error('Error creating order: ' + error.message);
    }
};

// Lấy toàn bộ danh sách đơn hàng và populate thông tin chi tiết của khách hàng
exports.getAllOrdersWithCustomerDetails = async () => {
    try {
        // Tìm tất cả các đơn hàng và populate thông tin từ bảng Customer
        const orders = await OrderModel.find().populate('customer_id', 'name email address phone');
        return orders;
    } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
    }
};

// Hàm lấy đơn hàng theo ID
exports.getOrderById = async (orderId) => {
    try {
        // Tìm đơn hàng theo ID và populate orderItems cùng với book_id
        return await OrderModel.findById(orderId)
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'book_id', // Populate thông tin của Book
                }
            });
    } catch (error) {
        console.error('Lỗi khi gọi hàm getOrderById:', error);
        throw error; // Ném lại lỗi để controller có thể xử lý
    }
};
// Lấy danh sách toàn bộ đơn hàng
exports.getAllOrders = async () => {
    try {
        // Tìm và trả về toàn bộ danh sách đơn hàng
        const orders = await OrderModel.find().populate('customer_id'); // Tìm tất cả và populate customer_id

        return orders; // Trả về danh sách đơn hàng
    } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
    }
};

exports.getCustomerById = async (customerId) => {
    try {
        return await Customer.findById(customerId).select('name email phone');
    } catch (error) {
        console.error('Lỗi khi lấy thông tin khách hàng:', error);
        throw error;
    }
};
exports.getOrdersByUpdateDate = async (date) => {
    try {
        // Chuyển đổi ngày thành định dạng ISO cho MongoDB
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1); // Thêm một ngày để lấy tất cả các bản ghi trong ngày

        // Tìm các đơn hàng có ngày cập nhật trong khoảng từ startDate đến endDate
        const orders = await OrderModel.find({
            updatedAt: {
                $gte: startDate,
                $lt: endDate
            }
        }).populate('customer_id', 'name email address phone');

        return orders;
    } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
    }
};
exports.getOrdersByShippingAddress = async (address) => {
    try {
        // Tìm các đơn hàng có địa chỉ nhận chứa địa chỉ đã nhập
        const orders = await OrderModel.find({
            shipping_address: { $regex: address, $options: 'i' } // Tìm kiếm không phân biệt chữ hoa chữ thường
        }).populate('customer_id', 'name email address phone');

        return orders;
    } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
    }
};
exports.getOrdersByStatus = async (status) => {
    try {
        // Truy vấn các đơn hàng có trạng thái `order_status` phù hợp
        const orders = await OrderModel.find({ order_status: status })
            .populate('customer_id', 'name email address phone')
            .populate('staff_id', 'name email')
            .populate('orderItems');

        return orders;
    } catch (error) {
        throw new Error('Error fetching orders by status: ' + error.message);
    }
};

// Service để xóa đơn hàng theo orderId
exports.deleteOrder = async (orderId) => {
    try {
        // Tìm và xóa đơn hàng theo orderId
        const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return null; // Nếu không tìm thấy đơn hàng
        }

        return deletedOrder; // Trả về thông tin của đơn hàng đã bị xóa
    } catch (error) {
        console.error('Lỗi khi xóa đơn hàng:', error);
        throw error;
    }
};






