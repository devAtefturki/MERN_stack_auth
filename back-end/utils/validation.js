const {check} = require ('express-validator');

exports.signupValidation=[
    check('name', 'Name field is required').not().isEmpty(),
    check('email', 'please provide a valid email').isEmail().normalizeEmail({gmail_remove_dots: true}),
    check('password','Password must be at least eight characters long').isLength({min:8})

]

exports.loginValidation=[
    check('email', 'Please provide a valid email').isEmail().normalizeEmail({gmail_remove_dots:true}),
    check('password', 'password must be at least eight characters long').isLength({min:8})
    
]
