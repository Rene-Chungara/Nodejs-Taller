const db = require('../config/config');
const bcrypt = require('bcryptjs');

const User = {};

User.finById = (id, result) =>{
    const sql = `
    SELECT u.id, 
        u.email, 
        u.name, 
        u.lastname, 
        u.image, 
        u.phone, 
        u.password, 
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', CONVERT(R.id, char),
                'name',r.name,
                'image',r.image,
                'route',r.route
            )
        ) as Roles

    FROM users as u

    INNER JOIN
        user_has_roles as uhr ON uhr.id_user = u.id
    INNER JOIN
        roles as r ON uhr.id_rol = r.id
    WHERE u.id = ?
    GROUP BY u.id;
    `;

    db.query(
        sql,
        [id],
        (err, user) => {
            if(err){
                console.log('Error: ', err);
                result(err, null);
            }
            else{
                console.log ('Usuario obtenido: ',user);
                result(null, user);
            }
        }
    )
}

User.findByEmail = (email, result) =>{
    const sql = `
        SELECT u.id, 
            u.email, 
            u.name, 
            u.lastname, 
            u.image, 
            u.phone, 
            u.password, 
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', CONVERT(R.id, char),
                    'name',r.name,
                    'image',r.image,
                    'route',r.route
                )
            ) as roles

        FROM users as u

        INNER JOIN
            user_has_roles as uhr ON uhr.id_user = u.id
        INNER JOIN
            roles as r ON uhr.id_rol = r.id
        WHERE email = ?
        GROUP BY u.id;
    `;

    db.query(
        sql,
        [email],
        (err, user) => {
            if(err){
                console.log('Error: ', err);
                result(err, null);
            }
            else{
                console.log ('Usuario obtenido: ',user[0]);
                result(null, user[0]);
            }
        }
    )
}

User.create = async(user, result)=>{
    const hash = await bcrypt.hash(user.password, 10);
    const sql = `
        INSERT INTO 
            users( 
                email, 
                name, 
                lastname, 
                phone, 
                image, 
                password, 
                created_at, 
                updated_at
            ) 
        values(?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
        sql,
        [
            user.email,
            user.name,
            user.lastname,
            user.phone,
            user.image,
            hash,
            new Date(),
            new Date()
        ],
        (err, res) => {
            if(err){
                console.log('Error: ', err);
                result(err, null);
            }
            else{
                console.log ('Id del nuevo usuario: ',res.insertId);
                result(null, res.insertId);
            }
        }
    )
}

User.findDeliveryMen = (result) => {
    const sql = `
    SELECT
        CONVERT(U.id, char) AS id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone
    FROM
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id 
    INNER JOIN
        roles AS R
    ON
        R.id = UHR.id_rol
    WHERE
        R.id = 2;
    `;

    db.query(
        sql,
        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, data);
            }
        }
    );
}

module.exports = User;
