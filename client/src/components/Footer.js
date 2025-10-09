import React from 'react'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0b1120', color: 'white', paddingTop: '40px', paddingBottom: '20px' }}>
      <div className='container'>
        <div className='row'>
            {/* Brand */}
          <div className="col-md-3 mb-4">
            <h4 style={{ fontWeight: 'bold' }}>Cartify</h4>
            <p style={{ color: '#cbd5e1' }}>
              Transform your shopping experience with our premium range of products.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled" style={{ color: '#cbd5e1' }}>
              <li><a href="#" className="text-decoration-none " style={{color:'#9CA3AF'}}>Products</a></li>
              <li><a href="#" className="text-decoration-none " style={{color:'#9CA3AF'}}>Contact</a></li>
              <li><a href="#" className="text-decoration-none " style={{color:'#9CA3AF'}}>Returns</a></li>
            </ul>
          </div>
          
           {/* Customer Care */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Customer Care</h5>
            <ul className="list-unstyled" style={{ color: '#cbd5e1' }}>
              <li><a href="#" className="text-decoration-none " style={{color:'#9CA3AF'}}>Contact Us</a></li>
              <li><a href="#" className="text-decoration-none " style={{color:'#9CA3AF'}}>Returns & Exchanges</a></li>
              <li><a href="#" className="text-decoration-none " style={{color:'#9CA3AF'}}>Privacy Policy</a></li>
              <li><a href="#" className="text-decoration-none " style={{color:'#9CA3AF'}}>Terms & Conditions</a></li>
            </ul>
          </div>

          
          {/* Contact Info */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Contact Info</h5>
            <ul className="list-unstyled" style={{ color: '#cbd5e1' }}>
              <li style={{color:'#9CA3AF'}}><i className="bi bi-telephone-fill me-2" ></i> +91 7885130809</li>
              <li style={{color:'#9CA3AF'}}><i className="bi bi-envelope-fill me-2"></i> contact@cartify.com</li>
              <li style={{color:'#9CA3AF'}}><i className="bi bi-geo-alt-fill me-2"></i> Delhi, India</li>
            </ul>
          </div>

        </div>

        {/* Bottom line */}
        <hr style={{ borderColor: '#334155' }} />
        <div className="text-center" style={{ color: '#94a3b8' }}>
          <p className="mb-0">© 2025 Cartify. All rights reserved.</p>
          <small>Built with ❤️ by Kamya</small>
        </div>
        
      </div>
    </footer>
  )
}

 
