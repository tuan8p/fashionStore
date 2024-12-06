# fashionStore

tải phiên bản nodejs mới nhất
trong thư mục backend tải djangorestframework bằng lệnh 
    pip install djangorestframework

chạy backend : dẫn vào thư mục backend, chạy lệnh python manage.py runserver

chạy frontend: chạy lệnh npm start hoặc vào package.json bấm debug và chọn start

nếu có lỗi thiếu react-router-dom thì tải bằng npm install react-router-dom

nếu lỗi config các gói trong node_modules thì xóa node_modules, package-lock.json, xóa các gói có từ web trong package.json (như  "web-vitals": "^2.1.4") rồi chạy lệnh pip install 